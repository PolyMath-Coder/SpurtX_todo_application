import { Module } from '@nestjs/common';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [],
  providers: [PrismaService, TodoService],
  controllers: [PrismaController, TodoController],
})
export class TodoModule {}
