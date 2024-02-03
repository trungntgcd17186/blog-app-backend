import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/enum/role';
import { IsUnique } from 'src/shared/validation/is-unique';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUnique({ tableName: 'user', column: 'email' })
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  password: string;

  @IsOptional()
  @Expose()
  @IsEnum(Role)
  role: Role;
}
