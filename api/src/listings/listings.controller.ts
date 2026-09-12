import { Controller, ParseIntPipe, Query, Body, Param, Req, Get, Post, Patch, UseGuards, UseInterceptors, UploadedFiles, Delete } from '@nestjs/common';
import { ListingsService } from './listings.service.js';
import { ListListingsDto } from './dto/list-listings.dto.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { UpdatePhotoDto } from './dto/update-photo.dto.js';
import type { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { photoStorage } from '../files/storage/photo.storage.js';
import { PhotoValidationPipe } from '../common/pipes/photo-validation.pipe.js';
import { ListingOwnerGuard } from './guards/listing-owner.guard.js';
import { Throttle } from '@nestjs/throttler';
import { FilesInterceptor } from '@nestjs/platform-express'; 

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Get()
    async findAll(@Query() query: ListListingsDto, @Req() request: Request) {
      const currentUser = request.user as { id: number; role: string };
      return await this.listingsService.findAll(query, currentUser);
    }

    @Post()
    async create(@Body() dto: CreateListingDto, @Req() request: Request) {
      const user = request.user as { id: number };
      return await this.listingsService.create(dto, user.id);
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
      return await this.listingsService.findOne(id, request.user as any);
    }
  
    @Patch(':id')
    async update( @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateListingDto, @Req() request: Request) {
      return await this.listingsService.update(id, dto, request.user as any);
    }
  
    @Roles('moderator')
    @Patch(':id/status')
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
      return await this.listingsService.updateStatus(id, dto);
    }

    @Get(':id/photos')
    async findPhotos(@Param('id', ParseIntPipe) id: number) {
      return await this.listingsService.findPhotos(id);
    }

    @Patch(':id/photos/:photoId')
    async updatePhoto(@Param('id', ParseIntPipe) id: number, @Param('photoId', ParseIntPipe) photoId: number, @Body() dto: UpdatePhotoDto) {
      return await this.listingsService.updatePhoto(id, photoId, dto);
    }

    @Throttle({ upload: { limit: 30, ttl: 15 * 60_000 } })
    @Post(':id/photos')
    @UseGuards(ListingOwnerGuard)
    @UseInterceptors(FilesInterceptor('photos', 5, { storage: photoStorage, limits: { fileSize: 5 * 1024 * 1024, files: 5 } }))
    async uploadPhotos(@Param('id', ParseIntPipe) id: number, @UploadedFiles(PhotoValidationPipe) files: Express.Multer.File[]) {
      return await this.listingsService.uploadPhotos(id, files);
    }

    @Delete(':id/photos/:photoId')
    @UseGuards(ListingOwnerGuard)
    async deletePhoto(@Param('id', ParseIntPipe) id: number, @Param('photoId', ParseIntPipe) photoId: number) {
      return await this.listingsService.deletePhoto(id, photoId);
    }
}
