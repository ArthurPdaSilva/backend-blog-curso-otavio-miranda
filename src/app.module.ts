import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { PostModule } from './post/post.module'
import { UploadModule } from './upload/upload.module'
import { UserModule } from './user/user.module'

// Decorator decora métodos ou funções adicionando configurações a mais para um módulo
@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Ele é um rate limiting para impedir abuso de requests
    // Ele fica assim no cabeçalho:
    // X-RateLimit-Limit: 10
    // X-RateLimit-Remaining: 9
    // X-RateLimit-Reset: 10
    // Dá para configurar global
    ThrottlerModule.forRoot({
      throttlers: [
        {
          // Time to live Durante 10s, o cliente pode fazer 10 requests
          ttl: 10000,
          limit: 10,
          // Se ele tentar fazer 11 requests durante 10s, ele manda um block de 5s
          blockDuration: 5000,
        },
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_DATABASE || './db.sqlite',
      synchronize: process.env.DB_SYNCHRONIZE === '1',
      // Ele tenta carregar todas as entidades por demanda
      autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
      // Alternativa para autoLoad: entities: [User, Post]
    }),
    UploadModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
