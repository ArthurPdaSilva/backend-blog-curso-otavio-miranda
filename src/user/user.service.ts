import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { HashingService } from 'src/common/hashing/hashing.service'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const exists = await this.userRepository.exists({
      where: {
        email: createUserDto.email,
      },
    })

    if (exists) {
      throw new ConflictException('Email já existe')
    }

    const hashedPassword = await this.hashingService.hash(
      createUserDto.password,
    )
    const newUser: CreateUserDto = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    }

    const created = await this.userRepository.save(newUser)
    return created
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email })
  }

  save(user: User) {
    return this.userRepository.save(user)
  }
}
