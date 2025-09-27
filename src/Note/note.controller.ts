// import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
// import { NoteService } from './note.service';

// @Controller('notes')
// export class NoteController {
//   constructor(private readonly noteService: NoteService) {}

//   // Create
//   @Post()
//   async create(@Body() body: { title: string; content: string; userId: number,date:string }) {
//     return this.noteService.create(body);
//   }

//   // Get all
//   @Get()
//   async findAll() {
//     return this.noteService.findAll();
//   }

//   // Get one
//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return this.noteService.findOne(Number(id));
//   }

//   // Update
//   @Put(':id')
//   async update(@Param('id') id: string, @Body() body: { title?: string; content?: string }) {
//     return this.noteService.update(Number(id), body);
//   }

//   // Delete
//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     return this.noteService.remove(Number(id));
//   }
// }


import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';

@Controller('notes')
@UseGuards(JwtAuthGuard) // 👈 protect all endpoints
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  // ✅ Create a note for the logged-in user
  @Post()
  async create(
    @Body() body: { title: string; content: string; date?: string },
    @Request() req: any,
  ) {
    return this.noteService.create({
      ...body,
      userId: req.user.userId, // ✅ secure, from JWT
      date: body.date ?? new Date().toISOString(),
    });
  }

  // ✅ Get all notes for logged-in user
  @Get()
  async findAll(@Request() req: any) {
    return this.noteService.findAll(req.user.userId);
  }

  // ✅ Get single note by id (only if it belongs to the logged-in user)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.noteService.findOne(id, req.user.userId);
  }

  // ✅ Update note (only if it belongs to the logged-in user)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title?: string; content?: string },
    @Request() req: any,
  ) {
    return this.noteService.update(id, body, req.user.userId);
  }

  // ✅ Delete note (only if it belongs to the logged-in user)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.noteService.remove(id, req.user.userId);
  }

 @Delete('all/:userId') // now expects a numeric string in URL
  async removeAll(@Param('userId', ParseIntPipe) userId: number) {
    // Prisma expects a number
    return this.noteService.removeAll(userId);
  }
}
