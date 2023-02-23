import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class CreateTodoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;
}
