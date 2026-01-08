import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@learning-hub.com' },
    update: {},
    create: {
      email: 'admin@learning-hub.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create instructor user
  const instructorPassword = await bcrypt.hash('Instructor123!', 10);
  await prisma.user.upsert({
    where: { email: 'instructor@learning-hub.com' },
    update: {},
    create: {
      email: 'instructor@learning-hub.com',
      name: 'Instructor User',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('User123!', 10);
  await prisma.user.upsert({
    where: { email: 'user@learning-hub.com' },
    update: {},
    create: {
      email: 'user@learning-hub.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });