import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { UsersModule } from './main/users/users.module';
import { JokesModule } from './main/jokes/jokes.module';
import AppDataSource from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    JokesModule,
  ],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
