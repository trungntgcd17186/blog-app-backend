import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseDto } from 'src/base/dto/date-dto';
import { Categories } from 'src/enum/categories';

export class FiltersBlogDto extends BaseDto {
  @IsOptional()
  @Expose()
  title: string;

  @IsOptional()
  @Expose()
  content: string;

  @IsOptional()
  @Expose()
  @IsEnum(Categories)
  categories: Categories;
}
