import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserLevel, AccountStatus } from './modules/users/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'secret123',
  database: 'staff_db',
  entities: [User],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOne({ where: { nationalCode: '1234567890' } });
  if (existing) {
    console.log('کاربر قبلاً ساخته شده');
    process.exit(0);
  }

  const password = await bcrypt.hash('1234567890', 10);

  const user = userRepo.create({
    nationalCode: '1234567890',
    personnelCode: 'P001',
    firstName: 'الهه',
    lastName: 'ایمانی',
    password,
    level: UserLevel.LEVEL_1,
    role: 'ریاست کل',
    status: AccountStatus.ACTIVE,
    mustChangePassword: true,
  });

  await userRepo.save(user);
  console.log('کاربر با موفقیت ساخته شد');
  process.exit(0);
}

seed().catch(console.error);
