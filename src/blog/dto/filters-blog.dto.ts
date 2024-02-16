import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { BaseDto } from 'src/base/dto/date-dto';
import { CreateBlogDto } from './create-blog.dto';

export class FiltersBlogDto extends IntersectionType(
  PartialType(
    PickType(CreateBlogDto, ['title', 'content', 'categories'] as const),
  ),
  PartialType(BaseDto),
) {}
