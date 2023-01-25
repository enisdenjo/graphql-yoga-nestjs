import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver.js';
import { PostService } from './post.service.js';

@Module({
  providers: [PostService, PostResolver],
  exports: [PostService],
})
export class PostModule {}
