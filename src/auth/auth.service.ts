import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Todo, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { doTypesOverlap } from 'graphql';
import { AuthController } from './auth.controller';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    //generate the password hash.
    const hash = await argon.hash(dto.password);

    //save the new user in the db.
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });
      delete user.hash;
      //return the saved user
      return { msg: user };
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Oops! This email is already registered with.',
          );
        }
      }
    }
  }

  async login(dto: AuthDto) {
    //check whether or not user exists

    const user = await this.prisma.user.findFirst(
      {
        where: {
          email: dto.email,
        },
      },
    );

    //if not, throw an exception.
    if (!user) {
      throw new ForbiddenException(
        'Oops! Kindly enter a registered email...',
      );
    }
    //where user exists, compare and verify passwords.
    const comparePassword = await argon.verify(
      user.hash,
      dto.password,
    );
    if (!comparePassword) {
      throw new ForbiddenException(
        'Incorrect Password... Kindly input the correct details.',
      );
    }

    //return user.
    delete user.hash;

    return { msg: user };
  }
}
