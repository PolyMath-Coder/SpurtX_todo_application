import { Injectable } from '@nestjs/common';
import { Todo, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  signup() {
    return { msg: 'I have signed up' };
  }

  login() {
    return { msg: 'I actually logged in...' };
  }
}
