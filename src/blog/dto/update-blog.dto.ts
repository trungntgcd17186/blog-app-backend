import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Categories } from 'src/enum/categories';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose()
  content?: string;

  @IsOptional()
  @Expose()
  @IsEnum(Categories)
  categories?: Categories;
}
