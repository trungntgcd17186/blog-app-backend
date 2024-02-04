import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';

export class BaseService<T> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly isDeleteUser: boolean = false,
  ) {}

  async deleteOne(
    id: number,
    loggedUserId?: number,
  ): Promise<{ success: boolean; entity?: T; error?: string }> {
    const findOptions: FindOneOptions<T> = {
      where: { id } as unknown as FindOptionsWhere<T>,
    };
    const entity = await this.repository.findOne(findOptions);

    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }

    if (this.isDeleteUser && loggedUserId && loggedUserId === id) {
      throw new ConflictException(
        `Cannot delete owner ${this.getEntityName().toLowerCase()}`,
      );
    }

    try {
      const res = await this.repository.remove(entity);
      return { success: true, entity: res };
    } catch (error) {
      console.error(
        `Error while deleting ${this.getEntityName().toLowerCase()}:`,
        error,
      );
      return { success: false, error: error.message };
    }
  }

  async deleteMultiple(
    ids: number[],
    loggedUserId?: number,
  ): Promise<{ success: boolean; error?: string }> {
    const findOptions: FindManyOptions<T> = {
      where: { id: In(ids) } as unknown as FindOptionsWhere<T>,
    };
    const entitiesToDelete = await this.repository.find(findOptions);

    if (entitiesToDelete.length !== ids.length) {
      const notFoundIds = ids.filter(
        (id) => !entitiesToDelete.find((entity: any) => entity.id === id),
      );

      if (notFoundIds.length > 0) {
        throw new NotFoundException(
          `${this.getEntityName()} with ids [${notFoundIds.join(
            ', ',
          )}] not found`,
        );
      }
    }

    if (this.isDeleteUser && loggedUserId && ids.includes(loggedUserId)) {
      throw new ConflictException(
        `Ids can not include logged ${this.getEntityName().toLowerCase()} id!`,
      );
    }

    try {
      await this.repository.remove(entitiesToDelete);
      return { success: true };
    } catch (error) {
      console.error(
        `Error while deleting multiple ${this.getEntityName().toLowerCase()}s:`,
        error,
      );
      return { success: false, error: error.message };
    }
  }

  private getEntityName(): string {
    const entityTarget: EntityTarget<T> = this.repository.target;
    return (entityTarget as any).name as string;
  }
}
