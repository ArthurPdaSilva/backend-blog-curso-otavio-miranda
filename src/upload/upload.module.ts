/** biome-ignore-all assist/source/organizeImports: false ppositive */
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { resolve } from 'node:path'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads', // define a URL base
      serveStaticOptions: {
        fallthrough: false, // não continua caso não encontre o arquivo
        index: false, // impede tentativa de servir "index.html"
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
