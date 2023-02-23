import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from '@nestjs/class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @MinLength(6)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
