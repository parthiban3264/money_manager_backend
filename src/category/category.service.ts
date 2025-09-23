// import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { Prisma, Category } from '@prisma/client';

// @Injectable()
// export class CategoryService {
//   constructor(private prisma: PrismaService) {}

//   // Seed default categories for a new user
//   async seedDefaultsForUser(userId: number) {
//     const count = await this.prisma.category.count({ where: { userId } });
//     if (count === 0) {
//       const defaults: Prisma.CategoryCreateInput[] = [
//         { name: 'Salary', type: 'Income', isDefault: true, user: { connect: { id: userId } } },
//         { name: 'Allowance', type: 'Income', isDefault: true, user: { connect: { id: userId } } },
//         { name: 'Food', type: 'Expense', isDefault: true, user: { connect: { id: userId } } },
//         { name: 'Shopping', type: 'Expense', isDefault: true, user: { connect: { id: userId } } },
//       ];
//       for (const data of defaults) {
//         await this.prisma.category.create({ data });
//       }
//     }
//   }

//   // Fetch categories by type for a user
//   async getCategories(userId: number, type: 'Income' | 'Expense'): Promise<Category[]> {
//     return this.prisma.category.findMany({
//       where: { userId, type },
//       orderBy: { createdAt: 'asc' },
//     });
//   }

//   // Create custom category
//   async createCategory(userId: number, name: string, type: 'Income' | 'Expense') {
//     return this.prisma.category.create({
//       data: { name, type, userId, isDefault: false },
//     });
//   }

//   // Update category name
//   async updateCategory(userId: number, id: number, name: string) {
//     const category = await this.prisma.category.findUnique({ where: { id } });
//     if (!category) throw new BadRequestException('Category not found');
//     if (category.userId !== userId) throw new ForbiddenException('Unauthorized');
//     return this.prisma.category.update({ where: { id }, data: { name } });
//   }

//   // Delete custom category
//   async deleteCategory(userId: number, id: number) {
//     const category = await this.prisma.category.findUnique({ where: { id } });
//     if (!category) throw new BadRequestException('Category not found');
//     if (category.userId !== userId) throw new ForbiddenException('Unauthorized');
//     if (category.isDefault) throw new BadRequestException('Cannot delete default category');
//     return this.prisma.category.delete({ where: { id } });
//   }
// }


import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Seed default categories for a new user
  async seedDefaultsForUser(userId: number): Promise<void> {
    const count = await this.prisma.category.count({ where: { userId } });
    if (count === 0) {
      const defaults: Prisma.CategoryCreateInput[] = [
        {
          name: 'Salary',
          type: 'Income',
          isDefault: true,
          user: { connect: { id: userId } },
        },
        {
          name: 'Allowance',
          type: 'Income',
          isDefault: true,
          user: { connect: { id: userId } },
        },
        {
          name: 'Food',
          type: 'Expense',
          isDefault: true,
          user: { connect: { id: userId } },
        },
        {
          name: 'Shopping',
          type: 'Expense',
          isDefault: true,
          user: { connect: { id: userId } },
        },
        {
          name: 'Cash',
          type: 'Account',
          isDefault: true,
          user: { connect: { id: userId } },
        },
      ];

      for (const data of defaults) {
        await this.prisma.category.create({ data });
      }
    }
  }

  // ✅ Fetch categories by type for a user
  async getCategories(
    userId: number,
    type: 'Income' | 'Expense' | 'Account',
  ): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { userId, type },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ✅ Create custom category
  async createCategory(
    userId: number,
    name: string,
    type: 'Income' | 'Expense' | 'Account',
  ): Promise<Category> {
    return this.prisma.category.create({
      data: { name, type, userId, isDefault: false },
    });
  }

  // ✅ Update category name
  async updateCategory(
    userId: number,
    id: number,
    name: string,
  ): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    if (category.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }
    return this.prisma.category.update({ where: { id }, data: { name } });
  }

  // ✅ Delete custom category
  async deleteCategory(userId: number, id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    if (category.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }
    if (category.isDefault) {
      throw new BadRequestException('Cannot delete default category');
    }
    return this.prisma.category.delete({ where: { id } });
  }
}
