import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from 'src/modules/auth/dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { CustomBadReRequestException } from 'src/shared/exceptions/custom-bad-request-exception';
import { customCode } from 'src/shared/constants/custom-code.constant';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async save(dto: CreateUserDto & { activated?: boolean }): Promise<UserDto> {
    const { username, email, password, fullname, activated } = dto;

    const usernameDuplicated = await this.userRepo.count({
      where: { username },
    });
    if (!!usernameDuplicated) {
      throw new CustomBadReRequestException(customCode.USERNAME_DUPLICATED);
    }

    const emailDuplicated = await this.userRepo.count({ where: { email } });
    if (!!emailDuplicated) {
      throw new CustomBadReRequestException(customCode.EMAIL_DUPLICATED);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username,
      email,
      password: hashedPassword,
      fullname,
      activated,
    } as User;

    const savedUser = await this.userRepo.save(user);

    return plainToInstance(UserDto, savedUser);
  }

  async getUserByEmail(email: string) {
    const savedUser = await this.userRepo.findOne({ where: { email } });

    const user = plainToInstance(UserDto, savedUser);
    if (savedUser) {
      user.password = savedUser.password;
    }

    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    const { password, ...result } = plainToInstance(UserDto, user);

    return result;
  }
}
