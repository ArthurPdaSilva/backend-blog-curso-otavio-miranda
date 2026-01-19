import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request'
import { CreatePostDto } from './dto/create-post.dto'
import { PostResponseDto } from './dto/post-response.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostService } from './post.service'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    const post = await this.postService.create(createPostDto, req.user)
    return new PostResponseDto(post)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  async findOneOwned(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const post = await this.postService.findOneOwnedOrFail({ id }, req.user)
    return new PostResponseDto(post)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findAllOwned(@Req() req: AuthenticatedRequest) {
    const posts = await this.postService.findAllOwned(req.user)
    return posts.map((post) => new PostResponseDto(post))
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postService.update({ id }, updatePostDto, req.user)
    return new PostResponseDto(post)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const post = await this.postService.remove({ id }, req.user)
    return new PostResponseDto(post)
  }

  @Get(':slug')
  async findOnePublished(@Param('slug') slug: string) {
    const post = await this.postService.findOneOrFail({
      slug,
      published: true,
    })
    return new PostResponseDto(post)
  }

  @Get()
  async findAllPublished() {
    const posts = await this.postService.findAll({ published: true })
    return posts.map((post) => new PostResponseDto(post))
  }
}
