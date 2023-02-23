import { ParseIntPipe } from '@nestjs/common';
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { User } from './models/user.model';
import { PostsService } from './posts.service';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(_returns => Post)
  post(@Args({ name: 'id', type: () => ID }, ParseIntPipe) id: number): Post | undefined {
    return this.postsService.findOne(id);
  }

  @Query(_returns => [Post])
  posts(): Post[] {
    return this.postsService.findAll();
  }

  @ResolveField(_of => User)
  user(@Parent() post: Post): any {
    return { __typename: 'User', id: post.authorId };
  }
}
