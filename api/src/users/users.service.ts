import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from "../prisma/prisma.service.js";
import { NotFoundError } from '../errors/app.exception.js';
import type { User, PublicUser } from './users.types.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

  private formatPublicUser(user: any): PublicUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  async create(data: CreateUserDto & { passwordHash?: string }): Promise<PublicUser> {
    const user = await this.prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        role: data.role,
        passwordHash: data.passwordHash ?? '',
        avatarFileName: data.avatarFileName ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.formatPublicUser(user);
  }

  async findAll(page?: number, limit?: number, role?: 'agent' | 'moderator') {
    const pageSizeDefault = Number(this.configService.get<number>('PAGE_SIZE_DEFAULT') ?? 20);
    const pageSizeMax = Number(this.configService.get<number>('PAGE_SIZE_MAX') ?? 100);

    const finalPage = (!page || page < 1) ? 1 : page;
    let finalLimit = (!limit || limit < 1) ? pageSizeDefault : limit;
    if (finalLimit > pageSizeMax) finalLimit = pageSizeMax;

    const whereCondition = role ? { role } : {};

    const [items, total] = await Promise.all([
      this.prisma.users.findMany({
        where: whereCondition,
        skip: (finalPage - 1) * finalLimit,
        take: finalLimit,
      }),
      this.prisma.users.count({ where: whereCondition })
    ]);

    const totalPages = total > 0 ? Math.ceil(total / finalLimit) : 0;
    const publicItems = items.map(user => this.formatPublicUser(user));

    return { items: publicItems, meta: { page: finalPage, limit: finalLimit, total, totalPages } };
  }

  async findOne(id: number): Promise<PublicUser> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User not found');
    return this.formatPublicUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.users.findUnique({ where: { email } });
  }

  async count(): Promise<number> {
    return this.prisma.users.count();
  }

  async update(id: number, data: UpdateUserDto): Promise<PublicUser> {
    try {
      const updatedUser = await this.prisma.users.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
      return this.formatPublicUser(updatedUser);
    } catch (error) {
      throw new NotFoundError('User not found');
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
