import { IsString } from 'class-validator';

export class CreateAccountCategoryDto {
  @IsString()
  name: string;
}
