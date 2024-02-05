import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from 'src/users/user.entity';
import { FiltersBlogDto } from './dto/filters-blog.dto';
import { BaseService } from 'src/base/base.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { omitEmptyField } from 'src/utils';

@Injectable()
export class BlogService extends BaseService<Blog> {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {
    super(blogRepository);
  }

  findById(id: number) {
    try {
      return this.blogRepository.findOne({
        where: { id },
        relations: ['user'],
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  create(userId: number, createBlogDto: CreateBlogDto) {
    const blog = this.blogRepository.create({
      ...createBlogDto,
      user: userId as unknown as User,
    });

    try {
      return this.blogRepository.save(blog);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getList(
    filters: FiltersBlogDto,
  ): Promise<{ list: Blog[]; total: number }> {
    const { page = 1, limit = 10, title, content, categories } = filters;
    const query = this.blogRepository.createQueryBuilder('blog');

    if (page && limit) {
      const offset = (+page - 1) * +limit;
      query.offset(offset).limit(+limit);
    }

    if (title) {
      query.andWhere('blog.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    if (content) {
      query.andWhere('blog.content ILIKE :content', {
        content: `%${content}%`,
      });
    }

    if (categories) {
      query.andWhere('blog.categories = :categories', { categories });
    }

    const [list, total] = await query
      .leftJoinAndSelect('blog.user', 'user')
      .orderBy('blog.createdAt', 'DESC')
      .getManyAndCount();
    return { list, total };
  }

  async update(
    id: number,
    params: UpdateBlogDto,
  ): Promise<{
    success: boolean;
    error?: string;
    blog?: Blog;
  }> {
    const newParams = omitEmptyField(params);
    const blog = await this.blogRepository.findOne({
      where: { id },
    });

    if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);
    const blogUpdated = {
      ...blog,
      ...newParams,
    };

    try {
      const newBlog = await this.blogRepository.save(blogUpdated);
      return { success: true, blog: newBlog };
    } catch (error) {
      console.error('Error while deleting blog:', error);
      return { success: false, error: error.message };
    }
  }
}
