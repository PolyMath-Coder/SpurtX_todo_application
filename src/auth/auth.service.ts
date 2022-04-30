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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
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
      // return { msg: user };
      return this.signToken(user.id, user.email);
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
    return this.signToken(user.id, user.email);

    //return user
    // delete user.hash;    /* This removes the password from the list of returned user items **/
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '45m',
        secret: secret,
      },
    );
    return { accessToken: token };
  }
}
