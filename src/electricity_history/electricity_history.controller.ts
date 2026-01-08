import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ElectricityHistoryService } from './electricity_history.service';
import { CreateElectricityHistoryDto } from './dto/create-electricity-history.dto';
import { UpdateElectricityHistoryDto } from './dto/update-electricity-history.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { RequestWithUser } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('electricity-history')
export class ElectricityHistoryController {
  constructor(
    private readonly electricityHistoryService: ElectricityHistoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createElectricityHistoryDto: CreateElectricityHistoryDto,
    @Request() req: RequestWithUser,
  ) {
    createElectricityHistoryDto.user_id = req.user.id;
    return this.electricityHistoryService.create(createElectricityHistoryDto);
  }

  @Get()
  async findAll(
    @Request() req: RequestWithUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.electricityHistoryService.findAll(
      req.user.id,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.electricityHistoryService.findOne(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateElectricityHistoryDto: UpdateElectricityHistoryDto,
    @Request() req: RequestWithUser,
  ) {
    return this.electricityHistoryService.update(
      id,
      req.user.id,
      updateElectricityHistoryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.electricityHistoryService.remove(id, req.user.id);
  }
}
