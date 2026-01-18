import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();


// Helpers: nest --help  

// Criando crud a partir do nest cli generate
// Criando módulo: nest g mo name
// Criando sérvice: nest g s name --no-spec (não gerar testes)
// Criando controller: nest g co name --no-spec (não gerar testes)
// Criando entity: nest g cl user/entities/user.entity --no-spec --flat 
// Criando dto: nest g cl user/dto/create.user.dto --no-spec --flat 
// Gerar tudo de uma vez: nest g res post