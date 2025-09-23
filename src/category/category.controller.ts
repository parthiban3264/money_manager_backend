// import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
// import { CategoryService } from './category.service';
// import { Category } from '@prisma/client';

// @Controller('categories')
// export class CategoryController {
//   constructor(private categoryService: CategoryService) {}

//   // Get categories by type
//   @Get(':type')
//   getCategories(@Param('type') type: 'Income' | 'Expense', @Req() req): Promise<Category[]> {
//     const userId = req.user.id; // assume user is attached via JWT middleware
//     return this.categoryService.getCategories(userId, type);
//   }

//   // Add new custom category
//   @Post()
//   createCategory(@Body() body: { name: string; type: 'Income' | 'Expense' }, @Req() req) {
//     const userId = req.user.id;
//     return this.categoryService.createCategory(userId, body.name, body.type);
//   }

//   // Update category
//   @Put(':id')
//   updateCategory(@Param('id') id: string, @Body() body: { name: string }, @Req() req) {
//     const userId = req.user.id;
//     return this.categoryService.updateCategory(userId, Number(id), body.name);
//   }

//   // Delete category
//   @Delete(':id')
//   deleteCategory(@Param('id') id: string, @Req() req) {
//     const userId = req.user.id;
//     return this.categoryService.deleteCategory(userId, Number(id));
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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { log } from 'console';

@Controller('categories')
@UseGuards(JwtAuthGuard) // ✅ Protect all routes
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ✅ Get categories by type
  @Get(':type')
  async getCategories(
    @Param('type') type: 'Income' | 'Expense' | 'Account',
    @Request() req: any,
  ): Promise<Category[]> {
    console.log('Fetching categories of type:', type, 'for user:', req.user);
    return this.categoryService.getCategories(req.user.userId, type);
  }
// ✅ Get all categories grouped by type
@Get()
async getAll(@Request() req: any) {
  const income = await this.categoryService.getCategories(req.user.userId, 'Income');
  const expense = await this.categoryService.getCategories(req.user.userId, 'Expense');
  const account = await this.categoryService.getCategories(req.user.userId, 'Account');
  
  return { income, expense, account };
}

  // ✅ Add new custom category
  @Post()
  async createCategory(
    @Body() body: { name: string; type: 'Income' | 'Expense'|'Account' },
    @Request() req: any,
  ) {
    console.log('name:', body.name, 'type:', body.type);
    console.log('User from JWT:', req.user);
    return this.categoryService.createCategory(
      req.user.userId,
      body.name,
      body.type,
    );
  }

  // ✅ Update category
  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name: string },
    @Request() req: any,
  ) {
    return this.categoryService.updateCategory(req.user.userId, id, body.name);
  }

  // ✅ Delete category
  @Delete(':id')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.categoryService.deleteCategory(req.user.userId, id);
  }
}
