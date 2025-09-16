import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';

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

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
