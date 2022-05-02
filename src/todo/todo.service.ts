import {
  ForbiddenException,
  Injectable,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTodoDto,
  EditTodoDto,
} from './dto';
import { Todo, User } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  async createTodo(
    userId: number,
    dto: CreateTodoDto,
    msg: string,
  ) {
    const todo = await this.prisma.todo.create({
      data: {
        userId,
        ...dto,
      },
    });
    return {
      msg: 'Congrats, you just created a task!',
      todo,
    };
  }
  getAllTodos(userId: number) {
    return this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
  }

  async getTodo(userId: number, toDoId: number) {
    return this.prisma.todo.findFirst({
      where: {
        id: toDoId,
        userId,
      },
    });
  }

  async updateTodo(
    userId: number,
    dto: any,
    toDoId: number,
  ) {
    //Get one todoitem over here.
    const todo =
      await this.prisma.todo.findUnique({
        where: {
          id: toDoId,
        },
      });
    //Check to ensure that the user did create the todo item.
    if (!todo || todo.userId !== userId) {
      throw new ForbiddenException(
        'Ooppss! Access to ToDoItem Denied...',
      );
    }
    return this.prisma.todo.update({
      where: {
        id: toDoId,
      },
      data: {
        ...dto,
      },
    });
  }

  //Check if user indeed created the todoitem

  async deleteTodo(
    userId: number,
    toDoId: number,
    msg: string,
  ) {
    const todo =
      await this.prisma.todo.findUnique({
        where: {
          id: toDoId,
        },
      });
    if (!todo || todo.userId !== userId) {
      throw new ForbiddenException(
        'Ooppss... Access to ToDoItem Denied...',
      );
    }
    //if a valid user, delete todoitem(s)
    const deletedTodo =
      await this.prisma.todo.delete({
        where: {
          id: toDoId,
        },
      });
    return {
      msg: 'This task was just Deleted!',
      deletedTodo,
    };
  }
}
