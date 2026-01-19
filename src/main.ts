import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { parseCorsWhitelist } from './common/utils/parse-cors-whitelist'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS -> Requisições entre sites
  // CSRF -> Proteção contra uso cookies maliciosos

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  )

  const corsWhiteList = parseCorsWhitelist(process.env.CORS_WHITELIST ?? '')

  app.enableCors({
    origin: (
      origin: string | undefined, // Isso é do navegador e para proteger o cliente
      // biome-ignore lint/suspicious/noExplicitAny: false positive
      callback: (...args: any[]) => void,
    ) => {
      // Requisição sem origin ou que inclui uma origem conhecida
      // por corsWhiteList é permitida
      if (!origin || corsWhiteList.includes(origin)) {
        return callback(null, true) // Permitido
      }

      // Requisições com origin mas que não conhecemos
      // negamos.
      return callback(new Error('Not allowed by CORS'), false)
    },
  })

  app.useGlobalPipes(
    new ValidationPipe({
      // Remover atributos que não foram mapeados nos meus dtos
      whitelist: true,
      // Dá erro com chaves não mapeadas
      forbidNonWhitelisted: true,
      // Transforma os objetos na instancia da classe do body ou params e não deixa como object apenas
      // transform: true,
    }),
  )
  await app.listen(process.env.APP_PORT ?? 3000)
}

bootstrap()

// Helpers: nest --help

// Criando crud a partir do nest cli generate
// Criando módulo: nest g mo name
// Criando sérvice: nest g s name --no-spec (não gerar testes)
// Criando controller: nest g co name --no-spec (não gerar testes)
// Criando entity: nest g cl user/entities/user.entity --no-spec --flat
// Criando dto: nest g cl user/dto/create.user.dto --no-spec --flat
// Gerar tudo de uma vez: nest g res post

// O env aqui, se vc atualizar, voce precisa reestartar a aplicação, pois o watch só olha para o src
