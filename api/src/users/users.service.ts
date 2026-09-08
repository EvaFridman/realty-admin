import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersRepository } from './users.repository.js'
import type { PublicUser } from './users.types.js'

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository, private readonly configService: ConfigService) {}

  create(data: CreateUserDto): PublicUser {
    return this.repo.create(data);
  }

  findAll(page?: number, limit?: number) {
    const pageSizeDefault = Number(this.configService.get<number>('PAGE_SIZE_DEFAULT') ?? 20);
    const pageSizeMax = Number(this.configService.get<number>('PAGE_SIZE_MAX') ?? 100);

    const finalPage = (!page || isNaN(page) || page < 1) ? 1 : page;
    let finalLimit = (!limit || isNaN(limit) || limit < 1) ? pageSizeDefault : limit;
    if (finalLimit > pageSizeMax) finalLimit = pageSizeMax;

    const { items, total } = this.repo.findAllPaginated(finalPage, finalLimit);

    const totalPages = total > 0 ? Math.ceil(total / finalLimit) : 0;

    return { items, meta: { page: finalPage, limit: finalLimit, total, totalPages } };
  }

  findOne(id: number): PublicUser {
    const user = this.repo.findUserById(id);
    if (!user) throw new NotFoundException('User not found')
    return user;
  }

  count(): number {
    return this.repo.count();
  }

  update(id: number, data: UpdateUserDto): PublicUser {
    const user = this.repo.update(id, data);
    if (!user) throw new NotFoundException('User not found')
    return user;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
