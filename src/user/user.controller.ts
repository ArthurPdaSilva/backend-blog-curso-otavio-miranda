import { Controller, Get, Param } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CustomParseIntPipe } from 'src/common/pipers/custom-parse-int-pipe.pipe'

@Controller('user')
export class UserController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    console.log(this.configService.get('TESTE', 'Padrão'))
    return `Ola, eu tenho o ${id} do tipo: ${typeof id}`
  }
}
