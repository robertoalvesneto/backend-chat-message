import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

// DTO
import { UserDto } from './dto/user.dto';

// Entities
import { User } from './entity/user.entity';

// Functions
import { hash } from 'src/common/function/hash.function';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  getOne(id: string): Promise<User> {
    return this.userRepo.findOne({ where: { id } });
  }

  create(data: UserDto): Promise<InsertResult> {
    const userEntity: User = this.userRepo.create(data);
    userEntity.password = hash(userEntity.password);

    return this.userRepo.insert(userEntity);
  }

  update(data: UserDto): Promise<UpdateResult> {
    return this.userRepo.update(data.id, {
      password: hash(data.password),
      name: data.name,
    });
  }
}
