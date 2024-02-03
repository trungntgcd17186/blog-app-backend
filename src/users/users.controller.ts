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
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-users.dto';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/role';
import { UpdateUserDto } from './dto/update-users.dto';
import { MultipleDeleteDto } from './dto/multiple-delete-users.dto';
import { FiltersUserDto } from './dto/filters-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user = plainToClass(CreateUserDto, createUserDto, {
      excludeExtraneousValues: true,
    });
    return this.usersService.create(user);
  }

  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  getList(
    @Query(new ValidationPipe({ transform: true }))
    filterUserDto: FiltersUserDto,
  ) {
    const filters = plainToClass(FiltersUserDto, filterUserDto, {
      excludeExtraneousValues: true,
    });
    return this.usersService.getList(filters);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const params = plainToClass(UpdateUserDto, updateUserDto, {
      excludeExtraneousValues: true,
    });
    return this.usersService.update(id, params);
  }

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('delete-multiple')
  deleteMultiple(
    @Body()
    body: MultipleDeleteDto,
    @Request() req,
  ) {
    return this.usersService.deleteMultiple(body.ids, req.user.sub);
  }

  @Roles([Role.MEMBER, Role.ADMIN])
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.deleteOne(id, req.user.sub);
  }
}
