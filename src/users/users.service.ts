import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
}
