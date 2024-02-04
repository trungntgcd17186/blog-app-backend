import { IsEnum } from 'class-validator';
import { Categories } from 'src/enum/categories';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('blog')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  @IsEnum(Categories)
  categories: Categories;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date = new Date();

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
