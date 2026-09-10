import { Controller, Query, ParseIntPipe, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ListUsersDto } from './dto/list-users.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { PublicUser } from './users.types.js';

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

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: string) {
  //   return this.usersService.remove(+id);
  // }
}
