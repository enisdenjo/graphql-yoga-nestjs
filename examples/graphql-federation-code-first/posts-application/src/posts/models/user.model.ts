import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(_type => ID)
  @Directive('@external')
  id!: number;

  @Field(_type => [Post])
  posts?: Post[];
}
