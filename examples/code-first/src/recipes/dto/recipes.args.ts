import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class RecipesArgs {
  @Field(_type => Int)
  @Min(0)
  skip = 0;

  @Field(_type => Int)
  @Min(1)
  @Max(50)
  take = 25;
}
