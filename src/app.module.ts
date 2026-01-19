import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { PostModule } from './post/post.module'
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
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_DATABASE || './db.sqlite',
      synchronize: process.env.DB_SYNCHRONIZE === '1',
      autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
