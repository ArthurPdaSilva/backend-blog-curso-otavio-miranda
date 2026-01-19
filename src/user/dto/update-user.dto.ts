import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'

// Partial deixa todos os atributos como opcionais
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}
