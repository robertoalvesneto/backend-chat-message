import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

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

  async getOne(name_identify: string): Promise<User> {
    if (!name_identify.includes('#')) throw new UnauthorizedException();
    const [name, secondPart] = name_identify.split('#');

    return await this.userRepo
      .createQueryBuilder('user')
      .where('name = :name', { name })
      .andWhere('SUBSTRING(id::text, 10, 4) = :secondPart', {
        secondPart,
      })
      .getOne();
  }

  async create(data: UserDto): Promise<{ name: string }> {
    const userEntity: User = this.userRepo.create(data);
    userEntity.password = hash(userEntity.password);

    const userSaved = await this.userRepo.save(userEntity);

    return { name: userSaved.name + '#' + userSaved.id.split('-')[1] };
  }

  update(data: UserDto): Promise<UpdateResult> {
    return this.userRepo.update(data.id, {
      password: hash(data.password),
      name: data.name,
    });
  }
}
