import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { ElectricityHistory } from './src/electricity_history/electricity_history.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

const caPath = path.join(process.cwd(), 'certificate', 'ca.pem');
const environment = process.env.NODE_ENV;
const sslConfig =
  environment === 'production'
    ? { ca: fs.readFileSync(caPath).toString() }
    : false;

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST!,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  synchronize: false, // Set to false for migrations
  logging: true,
  entities: [User, ElectricityHistory],
  migrations: ['src/database/migrations/**/*.ts'], // Where migrations will be stored
  ssl: sslConfig,
  subscribers: [],
});

export default AppDataSource;
