import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string
  @IsString({ message: 'Senha precisa ser string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  password: string
}
