import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsInt()
  userId: number;
}
