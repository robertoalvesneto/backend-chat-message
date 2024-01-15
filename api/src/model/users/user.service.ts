import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

// DTO
import { UserDto } from './dto/user.dto';

// Entities
import { User } from './entity/user.entity';

// Functions
import { hash } from 'src/common/function/hash.function';
import { MqttService } from 'src/queue/mqtt/mqtt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mqttService: MqttService,
  ) {}

  getOne(id: string): Promise<User> {
    this.mqttService.publish('message.send', { message: 'message' }, 2);
    return this.userRepo.findOne({ where: { id } });
  }

  create(data: UserDto): Promise<InsertResult> {
    const userEntity: User = this.userRepo.create(data);
    userEntity.password = hash(userEntity.password);

    return this.userRepo.insert(userEntity);
  }

  update(data: UserDto): Promise<UpdateResult> {
    return this.userRepo.update(data.id, { password: hash(data.password) });
  }
}
