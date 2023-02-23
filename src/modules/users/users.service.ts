import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from "./user.entity";
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    async findByEmail(email: string) {
        return this.usersRepository.findOneBy({ email });
    }

    async findById(id: number) {
        return this.usersRepository.findOneBy({ id });
    }

    async createUser(userData: any) {
        const userEntity = new UserEntity();
        userData.password = await this.encryptPassword(userData.password);
        userEntity.fill(userData);

        return await this.usersRepository.save(userEntity);
    }


    async updateRefreshToken(userId: number, refreshToken: string) {
        await this.usersRepository.update(
            { id: userId },
            { refresh_token: refreshToken },
        );
    }

    async validateUserEmail(email: string) {
        if (await this.findByEmail(email)) {
            throw new BadRequestException('Duplicate email');
        }
    }

    async encryptPassword(password: string) {
        const salt = await bcrypt.genSalt();

        return await bcrypt.hash(password, salt);
    }
}
