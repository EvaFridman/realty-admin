import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersRepository } from './users.repository.js'
import type { PublicUser } from './users.types.js'

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  create(data: CreateUserDto): PublicUser {
    return this.repo.create(data);
  }

  findAll(): PublicUser[] {
    return this.repo.findAll();
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
