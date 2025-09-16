import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsService } from './transaction/transactions.service';
import { PrismaService } from './prisma/prisma.service';
import { TransactionsController } from './transaction/transactions.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { NoteModule } from './Note/note.module';
import { TransferModule } from './Transfer/transfer.module';

@Module({
  imports: [NoteModule,TransferModule],
  controllers: [AppController,TransactionsController,UsersController],
  providers: [AppService,PrismaService,TransactionsService,UsersService],
})
export class AppModule {}
