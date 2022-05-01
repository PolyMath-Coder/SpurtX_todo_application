import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  todo_Activity: string;

  @IsString()
  @IsNotEmpty()
  statusOfActivity: string;

  @IsBoolean()
  @IsOptional()
  taskCompleted?: boolean;

  // @IsNumber()
  // @IsNotEmpty()
  // dueFutureDate: number;
}
