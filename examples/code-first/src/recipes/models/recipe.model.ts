import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'recipe ' })
export class Recipe {
  @Field(_type => ID)
  id!: string;

  @Directive('@upper')
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate!: Date;

  @Field(_type => [String])
  ingredients!: string[];
}
