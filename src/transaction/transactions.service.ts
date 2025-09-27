import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create transaction
  async create(data: {
    category: string;
    amount: number;
    type: TransactionType;
    note?: string;
    userId: number;
    date?: string;
    account?: string;
  }) {
    return this.prisma.transaction.create({
      data: {
        ...data,
        date: data.date ? data.date : new Date().toISOString(),
      },
    });
  }
  // ✅ Get all transactions for logged-in user
  // transactions.service.ts
  async findAll(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      select: {
        id: true,
        category: true,
        amount: true,
        type: true,
        note: true,
        date: true,
        account: true,
      },
    });
  }

  // ✅ Find one transaction (user-scoped)
  async findOne(id: number, userId: number) {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
    });
  }

  // ✅ Update transaction (only owner can update)
  async update(
    id: number,
    data: Prisma.TransactionUpdateInput,
    userId: number,
  ) {
    return this.prisma.transaction.updateMany({
      where: { id, userId },
      data,
    });
  }

  // ✅ Delete transaction (only owner can delete)
  async delete(id: number, userId: number) {
    return this.prisma.transaction.deleteMany({
      where: { id, userId },
    });
  }

  async deleteAll(userId: number): Promise<{ deletedCount: number }> {
    const result = await this.prisma.transaction.deleteMany({
      where: { userId }, // delete only the logged-in user's transactions
    });

    return { deletedCount: result.count }; // Prisma returns 'count'
  }
}
