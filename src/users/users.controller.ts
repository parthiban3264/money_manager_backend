// import { Controller, Post, Get, Body } from '@nestjs/common';
// import { UsersService } from './users.service';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Post('register')
//   register(@Body() body: { email: string; password: string; name?: string }) {
//     return this.usersService.register(body);
//   }

//   @Post('login')
//   login(@Body() body: { email: string; password: string }) {
//     return this.usersService.login(body);
//   }

//   // @Get()
//   // findAll() {
//   //   return this.usersService.findAll();
//   // }
// }


import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name?: string }) {
    return this.usersService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body);
  }

  @Get(':id')
  async getUser(@Param('id') id: number, @Request() req: any) {
    if (req.user.userId !== Number(id)) {
      throw new BadRequestException('Unauthorized access');
    }
    return this.usersService.getUser(Number(id));
  }

 @UseGuards(JwtAuthGuard)
@Put(':id')
async updateUser(
  @Param('id') id: number,
  @Body() body: { name?: string; email?: string; oldPassword?: string; newPassword?: string },
  @Request() req: any,
) {
  console.log(body);
  
  if (!req.user || req.user.userId !== Number(id)) {
    console.log('req.user:', req.user); // Debug
    throw new BadRequestException('Unauthorized update attempt');
  }

  return this.usersService.updateUser(Number(id), body);
}

}
