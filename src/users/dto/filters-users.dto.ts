import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/base/dto/date-dto';
import { Role } from 'src/enum/role';

export class FiltersUserDto extends BaseDto {
  @IsOptional()
  @Expose()
  email: string;

  @IsOptional()
  @IsString()
  @Expose()
  @IsEnum(Role)
  role: Role;
}
