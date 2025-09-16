import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransferService {
  constructor(private prisma: PrismaService) {}

  create(createTransferDto: CreateTransferDto) {
    return this.prisma.transfer.create({
      data: createTransferDto,
    });
  }

  findAll() {
    return this.prisma.transfer.findMany();
  }

  findOne(id: number) {
    return this.prisma.transfer.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTransferDto: UpdateTransferDto) {
    return this.prisma.transfer.update({
      where: { id },
      data: updateTransferDto,
    });
  }

  remove(id: number) {
    return this.prisma.transfer.delete({
      where: { id },
    });
  }
}
