import { BadRequestException } from '@nestjs/common'
import { memoryStorage } from 'multer'

// Isso é o storage do multer
// O memory storage fica na memória do servidor
export const storage = memoryStorage()

// CHECAGEM INICIAL

export const fileFilter = (
  // biome-ignore lint/suspicious/noExplicitAny: false positive
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('Somente imagens são permitidas!'), false)
  }
  cb(null, true)
}

export const limits = {
  // fileSize: 900 * 1024, // Limite de 900KB por imagem
}
