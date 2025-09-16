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

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Prisma } from '@prisma/client';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // ✅ Create
  @Post()
  async create(@Body() data: {
    category: string;
    amount: number;
    type: string;
    note?: string;
    userId: number;
    date?: string;
    account?: string;
  }) {
     console.log('Creating a new transaction...');
    return this.transactionsService.create(data);
  }

  // ✅ Get all
  @Get()
  async findAll() {
    return this.transactionsService.findAll();
  }

  // ✅ Get one by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(id);
  }

  // ✅ Update
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.TransactionUpdateInput,
  ) {
    return this.transactionsService.update(id, data);
  }

  // ✅ Delete
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.delete(id);
  }
}

