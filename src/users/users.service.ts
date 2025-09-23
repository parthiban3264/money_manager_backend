// import { Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class UsersService {
//   constructor(private prisma: PrismaService) {}

//   async register(data: { email: string; password: string; name?: string }) {
//     const hashed = await bcrypt.hash(data.password, 10);
//     return this.prisma.user.create({
//       data: {
//         email: data.email,
//         password: hashed,
//         name: data.name,
//       },
//     });
//   }

//   async login(data: { email: string; password: string }) {
//     const user = await this.prisma.user.findUnique({
//       where: { email: data.email },
//     });

//     if (!user) return { message: 'User not found' };

//     const valid = await bcrypt.compare(data.password, user.password);
//     if (!valid) return { message: 'Invalid password' };

//     return { message: 'Login successful', user };
//   }

//   async findAll() {
//     return this.prisma.user.findMany();
//   }
// }


import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Register new user
 async register(data: { email: string; password: string; name?: string }) {
  // 1️⃣ Check if email already exists
  const existing = await this.prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new ConflictException('Email already in use');

  // 2️⃣ Hash the password
  const hashed = await bcrypt.hash(data.password, 10);

  // 3️⃣ Create user in DB
  const user = await this.prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
    },
  });

  // 4️⃣ Remove password before returning
  const { password, ...result } = user;
  return result;
}

 // Login user
async login(data: { email: string; password: string }) {
  const user = await this.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new UnauthorizedException('User not found');

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new UnauthorizedException('Invalid password');

  const payload = { sub: user.id, email: user.email };

  // Generate access token only
  const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '30d' });

  // Return token and user info (without password)
  const { password, ...result } = user;
  return { access_token: accessToken, user: result };
}
async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true }, // include photo if needed
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async updateUser(
    id: number,
    updateData: { name?: string; email?: string; oldPassword?: string; newPassword?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    let password = user.password;

    // 🔑 Change password if requested
    if (updateData.oldPassword && updateData.newPassword) {
      const valid = await bcrypt.compare(updateData.oldPassword, user.password);
      if (!valid) throw new BadRequestException('Invalid old password');
      password = await bcrypt.hash(updateData.newPassword, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateData.name ?? user.name,
        email: updateData.email ?? user.email,
        password,
      },
      select: { id: true, name: true, email: true },
    });

    return updated;
  }


}
