import { Module } from '@nestjs/common';
import { DateScalar } from './date.scalar.js';
import { PostsResolvers } from './posts.resolvers.js';
import { PostsService } from './posts.service.js';
import { UsersResolvers } from './users.resolvers.js';

@Module({
  providers: [PostsResolvers, PostsService, UsersResolvers, DateScalar],
})
export class PostsModule {}
