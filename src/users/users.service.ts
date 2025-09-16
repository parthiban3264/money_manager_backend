import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(data: { email: string; password: string; name?: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
      },
    });
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) return { message: 'User not found' };

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return { message: 'Invalid password' };

    return { message: 'Login successful', user };
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}


// import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class UsersService {
//   constructor(private prisma: PrismaService, private jwtService: JwtService) {}

//   // Register new user
//   async register(data: { email: string; password: string; name?: string }) {
//     const existing = await this.prisma.user.findUnique({
//       where: { email: data.email },
//     });
//     if (existing) throw new ConflictException('Email already in use');

//     const hashed = await bcrypt.hash(data.password, 10);

//     const user = await this.prisma.user.create({
//       data: {
//         email: data.email,
//         password: hashed,
//         name: data.name,
//       },
//     });

//     // Remove password before returning
//     const { password, ...result } = user;
//     return result;
//   }

//   // Login user
//   async login(data: { email: string; password: string }) {
//     const user = await this.prisma.user.findUnique({
//       where: { email: data.email },
//     });

//     if (!user) throw new UnauthorizedException('User not found');

//     const valid = await bcrypt.compare(data.password, user.password);
//     if (!valid) throw new UnauthorizedException('Invalid password');

//     // Generate JWT
//     const payload = { sub: user.id, email: user.email };
//     const token = await this.jwtService.signAsync(payload);

//     // Return token and user info (without password)
//     const { password, ...result } = user;
//     return { access_token: token, user: result };
//   }

//   // Get all users (without passwords)
//   async findAll() {
//     const users = await this.prisma.user.findMany();
//     return users.map(({ password, ...u }) => u);
//   }
// }
