import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { YogaDriverConfig } from "../../src/index.js";
import { YogaDriver } from "../../src/drivers/index.js";
import { DirectionsModule } from "./directions/directions.module.js";
import { RecipesModule } from "./recipes/recipes.module.js";

@Module({
  imports: [
    RecipesModule,
    DirectionsModule,
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      // installSubscriptionHandlers: true,
      autoSchemaFile: true,
    }),
  ],
})
export class ApplicationModule {}
