import * as bcrypt from 'bcrypt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserInterface } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
    jwtConstants,
    jwtTokenSecretConstantsNames,
    jwtTokenExpirationTimes,
    jwtTokenTypes,
} from '../../common/constants';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    generateToken(payload: any, type: any) {
        return this.jwtService.sign(payload, {
            secret: jwtConstants[jwtTokenSecretConstantsNames[type]],
            expiresIn: jwtTokenExpirationTimes[type],
        });
    }

    async generateAccessAndRefreshTokens(user: any) {
        const payload = { email: user.email, id: user.id};

        return {
            access_token: this.generateToken(payload, jwtTokenTypes.ACCESS_TOKEN),
            refresh_token: this.generateToken(payload, jwtTokenTypes.REFRESH_TOKEN),
        };
    }

    async generateAccessToken(user: any) {
        const payload = { email: user.email, id: user.id };

        return {
            access_token: this.generateToken(payload, jwtTokenTypes.ACCESS_TOKEN),
        };
    }

    async signUp(body: UserSignupDto, res): Promise<UserInterface> {
        await this.usersService.validateUserEmail(body.email);
        const createdUser = await this.usersService.createUser(body);
        const tokens = await this.generateAccessAndRefreshTokens(createdUser);
        await this.usersService.updateRefreshToken(createdUser.id, tokens.refresh_token);

        res.cookie('refreshToken', tokens.refresh_token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        return res.send({
            ...new UserInterface().init(createdUser),
            ...{
                access_token: tokens.access_token
            }
        });
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }

        return null;
    }

    async login(user: any, res) {
        const tokens = await this.generateAccessAndRefreshTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

        res.cookie('refreshToken', tokens.refresh_token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        return res.send({
            access_token: tokens.access_token,
        });
    }

    async logout(userId: number, res) {
        res.clearCookie('refreshToken');

        res.send(await this.usersService.updateRefreshToken(userId, null));
    }

    async refreshToken(userId: number, refreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new ForbiddenException('Access denied');

        if (user.refresh_token !== refreshToken){
            throw new ForbiddenException('Access denied');
        }

        return await this.generateAccessToken(user);
    }
}
