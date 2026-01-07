import { PartialType } from '@nestjs/mapped-types';
import { CreateElectricityHistoryDto } from './create-electricity-history.dto';

export class UpdateElectricityHistoryDto extends PartialType(CreateElectricityHistoryDto) {}
