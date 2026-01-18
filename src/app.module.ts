import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

// Decorator decora métodos ou funções adicionando configurações a mais para um módulo
@Module({
  imports: [AuthModule, UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
