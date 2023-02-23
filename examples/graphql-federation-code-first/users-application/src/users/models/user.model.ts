import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(_type => ID)
  id!: number;

  @Field()
  name!: string;
}
