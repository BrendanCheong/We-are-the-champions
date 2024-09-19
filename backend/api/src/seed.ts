import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Logic to seed the database
  const plainPassword = 'password';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const user = await prisma.user.upsert({
    where: {
      email: 'test@gmail.com',
    },
    update: {},
    create: {
      email: 'test@gmail.com',
      username: 'test@gmail.com',
      passwordHash: hashedPassword,
    },
  });
  return user;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
