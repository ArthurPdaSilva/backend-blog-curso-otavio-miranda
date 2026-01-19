import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(
    // private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  // @Get(':id')
  // findOne(@Param('id', CustomParseIntPipe) id: number) {
  //   console.log(this.configService.get('TESTE', 'Padrão'))
  //   return `Ola, eu tenho o ${id} do tipo: ${typeof id}`
  // }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Ele resolve a promise automaticamente
    return this.userService.create(createUserDto)
  }
}
