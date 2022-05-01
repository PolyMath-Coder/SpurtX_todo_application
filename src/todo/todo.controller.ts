import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto';
import { EditTodoDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  getAllTodos(@GetUser('id') userId: number) {
    return this.todoService.getAllTodos(userId);
  }

  @Get(':id')
  getTodo(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) toDoId: number,
  ) {
    return this.todoService.getTodo(
      userId,
      toDoId,
    );
  }

  @Post('create')
  createTodo(
    @GetUser('id') userId: number,
    @Body() dto: CreateTodoDto,
  ) {
    console.log({
      dto,
    });
    return this.todoService.createTodo(
      userId,
      dto,
    );
  }

  @Patch(':id')
  editTodo(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) toDoId: number,
    @Body() dto: EditTodoDto,
  ) {
    return this.todoService.updateTodo(
      userId,
      dto,
      toDoId,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTodo(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) toDoId: number,
  ) {
    return this.todoService.deleteTodo(
      userId,
      toDoId,
    );
  }
}
