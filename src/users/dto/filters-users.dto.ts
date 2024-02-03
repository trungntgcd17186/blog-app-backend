import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/enum/role';

export class FiltersUserDto {
  @IsOptional()
  @IsString()
  @Expose()
  page: string;

  @IsOptional()
  @IsString()
  @Expose()
  limit: string;

  @IsOptional()
  @Expose()
  email: string;

  @IsOptional()
  @IsString()
  @Expose()
  name: string;

  @IsOptional()
  @IsString()
  @Expose()
  @IsEnum(Role)
  role: Role;
}
