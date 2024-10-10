import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const findUser = this.users.find(
      (user) => user.email == createUserDto.email,
    );
    if (findUser) {
      throw new ConflictException('User already exists.');
    }
    const user = new User();
    Object.assign(user, {
      ...createUserDto,
    });
    this.users.push(user);
    return plainToInstance(User, user);
  }

  findAll() {
    return plainToInstance(User, this.users);
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id == id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return plainToInstance(User, user);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id == id);
    if (userIndex < 0) {
      throw new NotFoundException('User not found.');
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return plainToInstance(User, this.users[userIndex]);
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id == id);
    if (userIndex < 0) {
      throw new NotFoundException('User not found.');
    }
    this.users.splice(userIndex, 1);
  }
}
