import { CacheModule, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import * as redisStore from 'cache-manager-redis-store'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    CacheModule.register({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
      }
    })
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
