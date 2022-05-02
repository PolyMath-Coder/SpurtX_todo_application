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
import { Todo } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  getAllTodos(@GetUser('id') userId: number) {
    return this.todoService.getAllTodos(userId);
  }

  @Get(':get-todo')
  getTodo(
    @GetUser('id') userId: number,
    @GetUser() user: Todo,
    @Param('get-todo', ParseIntPipe)
    toDoId: number,
  ) {
    // return { user: todo };
  }

  @Post('create-todo')
  createTodo(
    @GetUser('id') userId: number,
    @Body() dto: CreateTodoDto,
    msg: string,
  ) {
    console.log({
      dto,
    });
    const createdItem =
      this.todoService.createTodo(
        userId,
        dto,
        msg,
      );

    return createdItem;
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

  // @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTodo(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) toDoId: number,
    msg: string,
  ) {
    const deletedTask =
      this.todoService.deleteTodo(
        userId,
        toDoId,
        msg,
      );
    return deletedTask;
  }
}
