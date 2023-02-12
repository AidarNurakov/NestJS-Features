import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import PostsService from './posts.service';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard';
import FindOneParams from 'src/utils/findOneParams';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import RequestWithUser from 'src/authentication/requestWithUset.interface';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) { }

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Put(':id')
  async updatePost(@Param() { id }: FindOneParams, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    this.postsService.deletePost(Number(id));
  }
}
