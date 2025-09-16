import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Note } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  // Create
  async create(data: { title: string; content: string; userId: number,date:string }): Promise<Note> {
    return this.prisma.note.create({
      data,
    });
  }

  // Get all
  async findAll(): Promise<Note[]> {
    return this.prisma.note.findMany({
      include: { user: true },
    });
  }

  // Get one
  async findOne(id: number): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  // Update
  async update(id: number, data: { title?: string; content?: string }): Promise<Note> {
    return this.prisma.note.update({
      where: { id },
      data,
    });
  }

  // Delete
  async remove(id: number): Promise<Note> {
    return this.prisma.note.delete({
      where: { id },
    });
  }
}
