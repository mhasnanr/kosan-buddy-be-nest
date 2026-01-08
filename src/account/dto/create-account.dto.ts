import { IsString, IsNumber, Min, IsInt } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  balance: number;

  @IsInt()
  userId: number;
}
