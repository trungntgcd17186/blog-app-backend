import { IsEnum } from 'class-validator';
import { Role } from 'src/enum/role';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ default: Role.ADMIN })
  @IsEnum(Role)
  role: Role;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date = new Date();

  // @OneToMany(() => Post, (post) => post.user)
  // posts: Post[];
}
