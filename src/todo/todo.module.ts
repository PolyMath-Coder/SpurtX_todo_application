import { Module } from '@nestjs/common';
import { PrismaController } from 'src/prisma/prisma.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  providers: [PrismaService],
  controllers: [PrismaController],
})
export class TodoModule {}
