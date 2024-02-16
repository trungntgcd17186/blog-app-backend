import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { BaseDto } from 'src/base/dto/date-dto';
import { CreateUserDto } from './create-users.dto';
import { Expose } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';

export class FiltersUserDto extends IntersectionType(
  PartialType(BaseDto),
  PartialType(PickType(CreateUserDto, ['role'])),
) {
  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;
}
