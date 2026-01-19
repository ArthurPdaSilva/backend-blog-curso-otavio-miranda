import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonModule } from 'src/common/common.module'
import { User } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
