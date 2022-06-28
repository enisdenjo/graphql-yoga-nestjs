import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { YogaFederationDriver, YogaFederationDriverConfig } from "../../src.js";
import { PostModule } from "./post/post.module.js";
import { RecipeModule } from "./recipe/recipe.module.js";
import { User } from "./user/user.entity.js";
import { UserModule } from "./user/user.module.js";

@Module({
  imports: [
    UserModule,
    PostModule,
    RecipeModule,
    GraphQLModule.forRoot<YogaFederationDriverConfig>({
      driver: YogaFederationDriver,
      autoSchemaFile: true,
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
    }),
  ],
})
export class ApplicationModule {}
