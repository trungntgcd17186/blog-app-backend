import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/role';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { BlogService } from './blog.service';
import { FiltersBlogDto } from './dto/filters-blog.dto';
import { MultipleDeleteDto } from 'src/base/dto/multiple-delete.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateBlogDto, @Request() req) {
    const blog = plainToClass(CreateBlogDto, createUserDto, {
      excludeExtraneousValues: true,
    });
    return this.blogService.create(req.user.sub, blog);
  }

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  getList(
    @Query(new ValidationPipe({ transform: true }))
    filtersBlogDto: FiltersBlogDto,
  ) {
    const filters = plainToClass(FiltersBlogDto, filtersBlogDto, {
      excludeExtraneousValues: true,
    });
    return this.blogService.getList(filters);
  }

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findById(id);
  }

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const params = plainToClass(UpdateBlogDto, updateBlogDto, {
      excludeExtraneousValues: true,
    });
    return this.blogService.update(id, params);
  }

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('delete-multiple')
  deleteMultiple(
    @Body()
    body: MultipleDeleteDto,
    @Request() req,
  ) {
    return this.blogService.deleteMultiple(body.ids, req.user.sub);
  }

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.blogService.deleteOne(id, req.user.sub);
  }
}
