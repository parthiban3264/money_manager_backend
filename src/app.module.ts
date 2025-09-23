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
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/jwt.strategy';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 👈 .env load
    NoteModule,
    TransferModule,
    CategoryModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || '46501720c4de4deea09d4f960fa2313f',
      signOptions: { expiresIn: '30d' },
    }),

  ],
  controllers: [
    AppController,
    TransactionsController,
    UsersController,
  ],
  providers: [
    AppService,
    PrismaService,
    TransactionsService,
    UsersService,
  JwtStrategy,
  ],
})
export class AppModule {}
