import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import {
  ElectricityHistory,
  ElectricityHistoryType,
} from './electricity_history.entity';
import { CreateElectricityHistoryDto } from './dto/create-electricity-history.dto';
import { UpdateElectricityHistoryDto } from './dto/update-electricity-history.dto';

export interface ElectricityHistoryWithUsage extends ElectricityHistory {
  dailyUsage?: number;
}

@Injectable()
export class ElectricityHistoryService {
  constructor(
    @InjectRepository(ElectricityHistory)
    private readonly electricityHistoryRepository: Repository<ElectricityHistory>,
  ) {}

  async create(
    createElectricityHistoryDto: CreateElectricityHistoryDto,
  ): Promise<ElectricityHistory> {
    const { user_id, date, remaining_token } = createElectricityHistoryDto;

    // Find the previous day's entry for the user
    const previousEntry = await this.electricityHistoryRepository.findOne({
      where: {
        user_id,
        date: LessThan(date),
      },
      order: {
        date: 'DESC',
      },
    });

    let entryType = ElectricityHistoryType.RECORD;
    if (previousEntry && remaining_token > previousEntry.remaining_token) {
      entryType = ElectricityHistoryType.TOPUP;
    }

    const newHistory = this.electricityHistoryRepository.create({
      user_id,
      date,
      remaining_token,
      type: entryType,
    });

    return this.electricityHistoryRepository.save(newHistory);
  }

  async findAll(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ElectricityHistoryWithUsage[]> {
    let startQueryDate: string;
    let endQueryDate: string;

    if (startDate && endDate) {
      startQueryDate = startDate;
      endQueryDate = endDate;
    } else {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);
      endQueryDate = lastDayOfCurrentMonth.toISOString().split('T')[0];

      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastDayOfPreviousMonth = new Date(
        previousYear,
        previousMonth + 1,
        0,
      );
      startQueryDate = lastDayOfPreviousMonth.toISOString().split('T')[0];
    }

    // Fetch the history within the date range
    const historyInRange = await this.electricityHistoryRepository.find({
      where: {
        user_id: userId,
        date: Between(startQueryDate, endQueryDate),
      },
      order: { date: 'ASC' },
    });

    // Fetch the entry immediately preceding the start date to calculate usage for the first day
    const dayBeforeStartDate = await this.electricityHistoryRepository.findOne({
      where: {
        user_id: userId,
        date: LessThan(startQueryDate),
      },
      order: { date: 'DESC' },
    });

    // Combine the entries to calculate usage
    const allEntries = (
      dayBeforeStartDate
        ? [dayBeforeStartDate, ...historyInRange]
        : historyInRange
    ) as ElectricityHistoryWithUsage[];

    // Calculate daily usage
    for (let i = 1; i < allEntries.length; i++) {
      const previous = allEntries[i - 1];
      const current = allEntries[i];
      if (current.type === ElectricityHistoryType.RECORD) {
        current.dailyUsage = previous.remaining_token - current.remaining_token;
      } else {
        // Handle top-up visualization, if needed
        current.dailyUsage = 0; // Or indicate top-up, e.g., by usage being positive
      }
    }

    return historyInRange as ElectricityHistoryWithUsage[];
  }

  async findOne(id: string, userId: string): Promise<ElectricityHistory> {
    const history = await this.electricityHistoryRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!history) {
      throw new NotFoundException(
        `Electricity history with ID ${id} not found for user ${userId}`,
      );
    }
    return history;
  }

  async update(
    id: string,
    userId: string,
    updateElectricityHistoryDto: UpdateElectricityHistoryDto,
  ): Promise<ElectricityHistory> {
    const history = await this.findOne(id, userId); // Re-use findOne to check existence and ownership

    Object.assign(history, updateElectricityHistoryDto);
    return this.electricityHistoryRepository.save(history);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.electricityHistoryRepository.delete({
      id,
      user_id: userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Electricity history with ID ${id} not found for user ${userId}`,
      );
    }
  }
}
