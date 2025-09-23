// import { Controller, Get, Post, Body } from '@nestjs/common';
// import { TransactionsService } from './transactions.service';

// @Controller('transactions')
// export class TransactionsController {
//   constructor(private readonly transactionsService: TransactionsService) {}

//   @Post()
//   create(@Body() body: { category: string; amount: number; type: string; note?: string; userId: number;  date?: Date;
//     account?: string; }) {
//     return this.transactionsService.create(body);
//   }

//   @Get()
//   findAll() {
//     return this.transactionsService.findAll();
//   }
// }

// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Param,
//   Body,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { TransactionsService } from './transactions.service';
// import { Prisma } from '@prisma/client';

// @Controller('transactions')
// export class TransactionsController {
//   constructor(private readonly transactionsService: TransactionsService) {}

//   // ✅ Create
//   @Post()
//   async create(@Body() data: {
//     category: string;
//     amount: number;
//     type: string;
//     note?: string;
//     userId: number;
//     date?: string;
//     account?: string;
//   }) {
//      console.log('Creating a new transaction...');
//     return this.transactionsService.create(data);
//   }

//   // ✅ Get all
//   @Get()
//   async findAll() {
//     return this.transactionsService.findAll();
//   }

//   // ✅ Get one by ID
//   @Get(':id')
//   async findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.transactionsService.findOne(id);
//   }

//   // ✅ Update
//   @Put(':id')
//   async update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() data: Prisma.TransactionUpdateInput,
//   ) {
//     return this.transactionsService.update(id, data);
//   }

//   // ✅ Delete
//   @Delete(':id')
//   async delete(@Param('id', ParseIntPipe) id: number) {
//     return this.transactionsService.delete(id);
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
import { TransactionsService } from './transactions.service';
import { Prisma, TransactionType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('transactions')
@UseGuards(JwtAuthGuard) // 👈 protect all endpoints
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

@Post()
async create(@Body() data: {
  category: string;
  amount: number;
  type: string;
  note?: string;
  date?: string;
  account?: string;
}, @Request() req: any) {
  console.log('User from JWT:', req.user);
  return this.transactionsService.create({
    ...data,
    userId: req.user.userId,  // ✅ secure
    type: data.type as TransactionType,
    date: data.date ?? new Date().toISOString(),
  });
}
  // ✅ Get all for current user
  @Get()
  async findAll(@Request() req: any) {
    console.log('User from JWT:', req.user);
    return this.transactionsService.findAll(req.user.userId);
  }

  // ✅ Get one
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.transactionsService.findOne(id, req.user.userId);
  }

  // ✅ Update
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.TransactionUpdateInput,
    @Request() req: any,
  ) {
    return this.transactionsService.update(id, data, req.user.userId);
  }

  // ✅ Delete
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.transactionsService.delete(id, req.user.userId);
  }
}
