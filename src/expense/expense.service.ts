import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const { userId, date, ...expenseData } = createExpenseDto;
    const expense = this.expenseRepository.create({
      ...expenseData,
      date: new Date(date),
      user: { id: userId },
    });
    return this.expenseRepository.save(expense);
  }

  findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({ relations: ['user'] });
  }

  findOne(id: number): Promise<Expense | null> {
    return this.expenseRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense | null> {
    const { date, ...rest } = updateExpenseDto;
    const updatePayload: Partial<Expense> = { ...rest };
    if (date) {
      updatePayload.date = new Date(date);
    }
    const result = await this.expenseRepository.update(id, updatePayload);

    if (result.affected === 0) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.expenseRepository.delete(id);
  }
}
