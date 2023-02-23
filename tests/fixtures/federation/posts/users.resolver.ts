import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { User } from './models/user.model';
import { PostsService } from './posts.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly postsService: PostsService) {}

  @ResolveField(_of => [Post])
  public posts(@Parent() user: User): Post[] {
    return this.postsService.findAllByAuthorId(user.id);
  }
}
