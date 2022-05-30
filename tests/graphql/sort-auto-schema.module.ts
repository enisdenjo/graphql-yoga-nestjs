import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { YogaDriver, YogaDriverConfig } from "../../src";
import { DirectionsModule } from "../code-first/directions/directions.module";
import { RecipesModule } from "../code-first/recipes/recipes.module";

@Module({
  imports: [
    RecipesModule,
    DirectionsModule,
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      autoSchemaFile: "schema.graphql",
      sortSchema: true,
    }),
  ],
})
export class SortAutoSchemaModule {}
