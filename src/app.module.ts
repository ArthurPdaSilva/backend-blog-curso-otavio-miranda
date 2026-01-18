import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'


// Decorator decora métodos ou funções adicionando configurações a mais para um módulo
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
