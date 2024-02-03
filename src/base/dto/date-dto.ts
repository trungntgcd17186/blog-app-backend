import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { DateFieldValidationDecorator } from 'src/decorators';

export class BaseDateDto {
  constructor(useNotEmpty = false) {
    const decorator = DateFieldValidationDecorator(useNotEmpty);
    decorator(this, 'startDate');
    decorator(this, 'endDate');
  }

  @DateFieldValidationDecorator(true)
  startDate?: Date;

  @DateFieldValidationDecorator(true)
  endDate?: Date;
}

export class BaseDto extends BaseDateDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Expose()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(10000)
  @Expose()
  limit?: number;

  @IsOptional()
  @IsString()
  @Expose()
  search?: string;
}
