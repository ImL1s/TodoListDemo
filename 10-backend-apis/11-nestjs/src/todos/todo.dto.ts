import { IsString, IsBoolean, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text: string;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
