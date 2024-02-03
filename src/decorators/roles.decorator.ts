import { Reflector } from '@nestjs/core';
import { Role } from 'src/enum/role';

export const Roles = Reflector.createDecorator<Role[] | Role>();
