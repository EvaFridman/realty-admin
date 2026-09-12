import { Controller, Get, Param, StreamableFile, Response } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SafeFilenamePipe } from './pipes/safe-filename.pipe.js';
import { NotFoundError, ForbiddenError } from '../errors/app.exception.js'; 
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import type { Response as ExpressResponse } from 'express'; 
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Фотографии')
@Controller('files')
export class FilesController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Защищенное потоковое получение фотографии объявления' })
  @ApiResponse({ status: 200, description: 'Поток файла изображения', type: StreamableFile })
  @ApiResponse({ status: 400, description: 'Некорректный формат имени файла или попытка Path Traversal атак' })
  @ApiResponse({ status: 401, description: 'Токен отсутствует или невалиден' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен, агент не является владельцем объявления)' })
  @ApiResponse({ status: 404, description: 'Фотография или файл на диске не найдены' })
  @Get('photos/:fileName')
  async getPhoto(@Param('fileName', SafeFilenamePipe) fileName: string, @Response({ passthrough: true }) res: ExpressResponse): Promise<StreamableFile> {
    const photo = await this.prisma.listingPhotos.findFirst({ where: { fileName: fileName } });
    if (!photo) throw new NotFoundError('Photo not found', null, 'PHOTO_NOT_FOUND');

    const user = res.req.user as { id: number; role: string };
    if (user.role !== 'moderator') {
      const listing = await this.prisma.listings.findUnique({ where: { id: photo.listingId } });
      if (!listing || listing.agentId !== user.id) throw new ForbiddenError('Forbidden access to this photo', null, 'FORBIDDEN');
    }

    const filePath = path.resolve(`./uploads/photos/${fileName}`);
    if (!fs.existsSync(filePath)) throw new NotFoundError('Physical file not found on disk', null, 'FILE_NOT_FOUND');

    const contentType = mime.lookup(filePath) || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    return new StreamableFile(fs.createReadStream(filePath));
  }

  @ApiOperation({ summary: 'Публичное потоковое получение аватарки пользователя' })
  @ApiResponse({ status: 200, description: 'Поток файла изображения', type: StreamableFile })
  @ApiResponse({ status: 400, description: 'Некорректный формат имени файла' })
  @ApiResponse({ status: 404, description: 'Файл аватарки не найден на диске' })
  @Get('avatars/:fileName')
  async getAvatar(  @Param('fileName', SafeFilenamePipe) fileName: string, @Response({ passthrough: true }) res: ExpressResponse): Promise<StreamableFile> {
    const filePath = path.resolve(`./uploads/avatars/${fileName}`);
    if (!fs.existsSync(filePath)) throw new NotFoundError('Avatar file not found on disk', null, 'AVATAR_NOT_FOUND');
    const contentType = mime.lookup(filePath) || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    return new StreamableFile(fs.createReadStream(filePath));
  }
}