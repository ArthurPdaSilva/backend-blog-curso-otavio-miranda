import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { HashingService } from 'src/common/hashing/hashing.service'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async failIfEmailExists(email: string) {
    // const exists = await this.userRepository.exists({
    //   where: {
    //     email: createUserDto.email,
    //   },
    // })

    const exists = await this.userRepository.existsBy({
      email,
    })

    if (exists) {
      throw new ConflictException('E-mail já existe')
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.failIfEmailExists(createUserDto.email)

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

  async findByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData)
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.email && !updateUserDto.name) {
      throw new BadRequestException('Dados não enviados')
    }

    const user = await this.findByOrFail({ id })
    user.name = updateUserDto.name ?? user.name

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.failIfEmailExists(updateUserDto.email)
      user.email = updateUserDto.email
      user.forceLogout = true
    }

    return this.save(user)
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findByOrFail({ id })

    const isCurrentPasswordValid = await this.hashingService.compare(
      updatePasswordDto.currentPassword,
      user.password,
    )

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual inválida')
    }

    user.password = await this.hashingService.hash(
      updatePasswordDto.newPassword,
    )
    user.forceLogout = true

    return this.save(user)
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email })
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id })
  }

  save(user: User) {
    return this.userRepository.save(user)
  }
}
