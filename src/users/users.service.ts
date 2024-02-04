import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/base/base.service';
import { omitEmptyField } from 'src/utils';
import { UpdateUserDto } from './dto/update-users.dto';
import { FiltersUserDto } from './dto/filters-users.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super(userRepository, true);
  }

  findById(id: number) {
    try {
      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(error);
    }
  }

  findByEmailAndReturnPassword(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async generateAccessToken(payload: {
    sub: number;
    email: string;
    role: string;
  }): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
    });

    return accessToken;
  }

  async create(createUserDto: CreateUserDto): Promise<object> {
    try {
      const user = {
        email: createUserDto.email,
        role: createUserDto.role,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      };

      const newUser = await this.userRepository.save({
        ...user,
        password: await bcrypt.hash(createUserDto.password, 10),
      });
      const payload = {
        sub: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };

      const accessToken = await this.generateAccessToken(payload);
      return { ...user, accessToken };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async getList(
    filters: FiltersUserDto,
  ): Promise<{ list: User[]; total: number }> {
    const { page = 1, limit = 10, role, search, email } = filters;
    const query = this.userRepository.createQueryBuilder('user');

    if (page && limit) {
      const offset = (+page - 1) * +limit;
      query.offset(offset).limit(+limit);
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (search) {
      query.andWhere(`CONCAT(user.firstName, ' ', user.lastName) ILIKE :name`, {
        name: `%${search}%`,
      });
    }

    if (email) {
      query.andWhere('user.email = :email', { email });
    }

    const [list, total] = await query
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();
    return { list, total };
  }

  async update(
    id: number,
    params: UpdateUserDto,
  ): Promise<{
    success: boolean;
    error?: string;
    user?: Omit<User, 'password'>;
  }> {
    const newParams = omitEmptyField(params);
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    const userUpdated = {
      ...user,
      ...newParams,
    };

    if (userUpdated.password)
      userUpdated.password = await bcrypt.hash(params.password, 10);

    try {
      const { password, ...user } = await this.userRepository.save(userUpdated);
      return { success: true, user };
    } catch (error) {
      console.error('Error while deleting user:', error);
      return { success: false, error: error.message };
    }
  }
}
