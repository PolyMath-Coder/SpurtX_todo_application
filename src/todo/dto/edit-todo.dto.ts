import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditTodoDto {
  @IsString()
  @IsOptional()
  todo_Activity?: string;

  @IsString()
  @IsOptional()
  statusOfActivity?: string;

  @IsBoolean()
  @IsOptional()
  taskCompleted?: boolean;

  // @IsNumber()
  // @IsOptional()
  // dueFutureDate?: number;
}
