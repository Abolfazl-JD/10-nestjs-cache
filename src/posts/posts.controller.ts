import { Controller, Get, Post, Body, Param, Delete, Query, UseInterceptors, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostsDto } from './dto/find-posts.dto';
import { GET_POSTS_CACHE_KEY } from './constants/cache-key.constant';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(100)
  @Get()
  findAll(@Query() findPostsDto: FindPostsDto) {
    return this.postsService.findAll(findPostsDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('cache-test-route')
  @CacheTTL(30)
  @Get('test-caching')
  testCaching() {
    return this.postsService.testCaching()
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('get-single-post')
  @CacheTTL(30)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
