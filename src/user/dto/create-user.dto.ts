import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string

  @IsString({ message: 'Nome precisa ser string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name: string

  @IsString({ message: 'Senha precisa ser string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  @MinLength(6, { message: 'Senha  deve ter um mínimo de 6 caracteres' })
  password: string
}
