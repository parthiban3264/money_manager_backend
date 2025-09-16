import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  // Create
  @Post()
  async create(@Body() body: { title: string; content: string; userId: number,date:string }) {
    return this.noteService.create(body);
  }

  // Get all
  @Get()
  async findAll() {
    return this.noteService.findAll();
  }

  // Get one
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.noteService.findOne(Number(id));
  }

  // Update
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { title?: string; content?: string }) {
    return this.noteService.update(Number(id), body);
  }

  // Delete
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.noteService.remove(Number(id));
  }
}
