import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/enum/role';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Expose()
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;

  @IsOptional()
  @Expose()
  @IsEnum(Role)
  role?: Role;
}
