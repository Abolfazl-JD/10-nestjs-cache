import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostsDto } from './dto/find-posts.dto';
import { Post } from './entities/post.entity';
import { Cache } from 'cache-manager'
import { GET_POSTS_CACHE_KEY } from './constants/cache-key.constant';

@Injectable()
export class PostsService {
  
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys()
    console.log('keys are : ', keys)
    for (const key of keys) {
      if(key.startsWith(GET_POSTS_CACHE_KEY)) this.cacheManager.del(key)
    }
  }

  async create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto)
    await this.clearCache()
    return this.postsRepository.save(post)
  }

  findAll(findPostsDto: FindPostsDto) {
    const { skip = 0, take = 10 } = findPostsDto
    return this.postsRepository.find({
      skip,
      take
    })
  }

  async testCaching() {
    console.log('name : ', await this.cacheManager.get("get-single-post"))
    return 'in-memory chache tested'
  }

  findOne(id: number) {
    return this.postsRepository.findOneBy({ id })
  }

  async remove(id: number) {
    const post = await this.findOne(id)
    await this.postsRepository.remove(post)
    console.log('\n post was successfully deleted')
    await this.clearCache()
  }
}
