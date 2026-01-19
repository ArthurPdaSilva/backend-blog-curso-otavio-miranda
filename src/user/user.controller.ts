import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request'
import { CustomParseIntPipe } from 'src/common/pipers/custom-parse-int-pipe.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  // Guard para autenticação com jwt
  // @UseGuards(AuthGuard('jwt'))
  // Minha personalização
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', CustomParseIntPipe) id: number,
  ) {
    console.log(req.user)
    console.log(this.configService.get('TESTE', 'Padrão'))
    return `Ola, eu tenho o ${id} do tipo: ${typeof id}`
  }

  // Tive q passar para async pq to traduzindo o dto para respons
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // Ele resolve a promise automaticamente
    const user = await this.userService.create(createUserDto)
    return new UserResponseDto(user)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(req.user.id, updateUserDto)
    return new UserResponseDto(user)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.userService.updatePassword(
      req.user.id,
      updatePasswordDto,
    )
    return new UserResponseDto(user)
  }
}
