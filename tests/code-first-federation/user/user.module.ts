import { Module } from '@nestjs/common';
import { PostModule } from '../post/post.module.js';
import { UserResolver } from './user.resolver.js';

@Module({
  providers: [UserResolver],
  imports: [PostModule],
})
export class UserModule {}
