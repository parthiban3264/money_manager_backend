// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { Note } from '@prisma/client';

// @Injectable()
// export class NoteService {
//   constructor(private prisma: PrismaService) {}

//   // Create
//   async create(data: { title: string; content: string; userId: number,date:string }): Promise<Note> {
//     return this.prisma.note.create({
//       data,
//     });
//   }

//   // Get all
//   async findAll(): Promise<Note[]> {
//     return this.prisma.note.findMany({
//       include: { user: true },
//     });
//   }

//   // Get one
//   async findOne(id: number): Promise<Note | null> {
//     return this.prisma.note.findUnique({
//       where: { id },
//       include: { user: true },
//     });
//   }

//   // Update
//   async update(id: number, data: { title?: string; content?: string }): Promise<Note> {
//     return this.prisma.note.update({
//       where: { id },
//       data,
//     });
//   }

//   // Delete
//   async remove(id: number): Promise<Note> {
//     return this.prisma.note.delete({
//       where: { id },
//     });
//   }
// }

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Note } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create a new note
  async create(data: {
    title: string;
    content: string;
    userId: number;
    date: string;
  }): Promise<Note> {
    return this.prisma.note.create({
      data,
    });
  }

  // ✅ Get all notes for a specific user
  async findAll(userId: number): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { date: 'desc' }, // latest first
    });
  }

  // ✅ Get one note, but only if it belongs to the user
  async findOne(id: number, userId: number): Promise<Note> {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  // ✅ Update note (only if it belongs to the user)
  async update(
    id: number,
    data: { title?: string; content?: string },
    userId: number,
  ): Promise<Note> {
    const note = await this.findOne(id, userId);
    if (!note) {
      throw new ForbiddenException('You cannot update this note');
    }

    return this.prisma.note.update({
      where: { id },
      data,
    });
  }

  // ✅ Delete note (only if it belongs to the user)
  async remove(id: number, userId: number): Promise<Note> {
    const note = await this.findOne(id, userId);
    if (!note) {
      throw new ForbiddenException('You cannot delete this note');
    }

    return this.prisma.note.delete({
      where: { id },
    });
  }

// notes.service.ts
async removeAll(userId: number): Promise<{ deletedCount: number }> {
  const result = await this.prisma.note.deleteMany({
    where: { userId }, // ensures only this user's notes are deleted
  });

  return { deletedCount: result.count };
}
}
