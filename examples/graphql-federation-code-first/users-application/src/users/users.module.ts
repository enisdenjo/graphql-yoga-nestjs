import {
  YogaFederationDriver,
  YogaFederationDriverConfig,
} from "@graphql-yoga/nestjs";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    GraphQLModule.forRoot<YogaFederationDriverConfig>({
      driver: YogaFederationDriver,
      autoSchemaFile: true,
    }),
  ],
})
export class UsersModule {}
