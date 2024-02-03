import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { plainToClass } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = plainToClass(LoginDto, loginDto);
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Wrong Password!');
    }
    return this.authService.login(user);
  }
}
