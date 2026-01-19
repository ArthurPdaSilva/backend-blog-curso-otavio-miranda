import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { createSlugFromText } from 'src/common/utils/create-slug-from-text'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post } from './entities/post.entity'

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name)

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: ['author'],
    })

    return post
  }

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData)

    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    return post
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postData,
        author: { id: author.id },
      },
      relations: ['author'],
    })

    return post
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author)
    if (!post) {
      throw new NotFoundException('Post não encontrado')
    }

    return post
  }

  async create(createPostDto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: createSlugFromText(createPostDto.title),
      title: createPostDto.title,
      excerpt: createPostDto.excerpt,
      content: createPostDto.content,
      coverImageUrl: createPostDto.coverImageUrl,
      author,
    })

    const created = await this.postRepository
      .save(post)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          this.logger.error('Erro ao criar post:', err.stack)
        }
        throw new BadRequestException('Erro ao criar o post')
      })
    return created
  }

  async findAllOwned(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      order: {
        // O mais novo fica em cima
        createdAt: 'DESC',
      },
      // Para trazer o autor relacionado
      relations: ['author'],
    })

    return posts
  }

  async update(
    postData: Partial<Post>,
    updatePostDto: UpdatePostDto,
    author: User,
  ) {
    if (Object.keys(updatePostDto).length === 0) {
      throw new BadRequestException('Dados não enviados')
    }

    const post = await this.findOneOwnedOrFail(postData, author)

    post.title = updatePostDto.title ?? post.title
    post.content = updatePostDto.content ?? post.content
    post.excerpt = updatePostDto.excerpt ?? post.excerpt
    post.coverImageUrl = updatePostDto.coverImageUrl ?? post.coverImageUrl
    post.published = updatePostDto.published ?? post.published

    return this.postRepository.save(post)
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOrFail(postData)
    await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    })
    return post
  }

  async findAll(postData: Partial<Post>) {
    const posts = await this.postRepository.find({
      where: postData,
      order: {
        // O mais novo fica em cima
        createdAt: 'DESC',
      },
      // Para trazer o autor relacionado
      relations: ['author'],
    })

    return posts
  }
}
