import { Controller, Query, ParseIntPipe, Get, Post, Body, Patch, Param, UploadedFile, UseGuards, Delete, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ListUsersDto } from './dto/list-users.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { PublicUser } from './users.types.js';
import { avatarStorage } from '../files/storage/avatar.storage.js';
import { PhotoValidationPipe } from '../common/pipes/photo-validation.pipe.js';
import { UserAvatarAccessGuard } from './guards/user-avatar-access.guard.js';

@Roles("moderator")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<PublicUser> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() query: ListUsersDto) {
    const { page, limit, role } = query;
    return await this.usersService.findAll(page, limit, role);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<PublicUser> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Throttle({ upload: { limit: 30, ttl: 15 * 60_000 } })
  @UseGuards(UserAvatarAccessGuard)
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar', { storage: avatarStorage, limits: { fileSize: 5 * 1024 * 1024 } }))
  async updateAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile(PhotoValidationPipe) file: Express.Multer.File) {
    return await this.usersService.updateAvatar(id, file);
  }

  @UseGuards(UserAvatarAccessGuard)
  @Delete(':id/avatar')
  async removeAvatar(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.removeAvatar(id);
  }
}
