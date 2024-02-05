import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/base/dto/date-dto';
import { Categories } from 'src/enum/categories';

export class FiltersBlogDto extends BaseDto {
  @IsOptional()
  @Expose()
  @IsString()
  title: string;

  @IsOptional()
  @Expose()
  @IsString()
  content: string;

  @IsOptional()
  @Expose()
  @IsEnum(Categories)
  categories: Categories;
}
