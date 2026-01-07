import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity'; // Assuming User entity path

export enum ElectricityHistoryType {
  RECORD = 'record',
  TOPUP = 'topup',
}

@Entity('electricity_history')
export class ElectricityHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string; // Storing date as string 'YYYY-MM-DD' for simplicity or use Date object

  @Column({ type: 'float' })
  remaining_token: number; // kWh

  @Column({
    type: 'enum',
    enum: ElectricityHistoryType,
    default: ElectricityHistoryType.RECORD,
  })
  type: ElectricityHistoryType;

  @ManyToOne(() => User, (user) => user.electricityHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;
}
