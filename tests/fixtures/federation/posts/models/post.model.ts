import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
@Directive('@key(fields: "id")')
export class Post {
  @Field(_type => ID)
  id!: number;

  @Field()
  title!: string;

  @Field(_type => Int)
  authorId!: number;

  @Field(_type => User)
  user?: User;
}
