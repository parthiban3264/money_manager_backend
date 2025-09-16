import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(data: {
    category: string;
    amount: number;
    type: string;
    note?: string;
    userId: number;
    date?: string; // optional; default to now
    account?: string; // optional
  }) {
    return this.prisma.transaction.create({
      data: {
        ...data,
        date: data.date,
      } as Prisma.TransactionUncheckedCreateInput,
    });
  }

  // ✅ Read all
  async findAll() {
    return this.prisma.transaction.findMany({
      select: {
        id: true,
        category: true,
        amount: true,
        type: true,
        note: true,
        date: true,
        account: true,
        user: true,
      },
    });
  }

  // ✅ Find one by ID
  async findOne(id: number) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  // ✅ Update
  async update(id: number, data: Prisma.TransactionUpdateInput) {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  // ✅ Delete
  async delete(id: number) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
