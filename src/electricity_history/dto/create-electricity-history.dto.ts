import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateElectricityHistoryDto {
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsNumber()
  @IsNotEmpty()
  remaining_token: number; // kWh

  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
