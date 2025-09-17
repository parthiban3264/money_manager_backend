import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtModule } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '30d' }, // access token expire 15 minutes
})
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
