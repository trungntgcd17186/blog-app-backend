import { IsArray, IsNumber } from 'class-validator';

export class MultipleDeleteDto {
  @IsArray()
  @IsNumber(
    {},
    { each: true, message: 'Each element in userIds must be a number.' },
  )
  ids: number[];
}
