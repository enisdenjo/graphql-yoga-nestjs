import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { YogaDriver, YogaDriverConfig } from "../../src.js";
import { CatsModule } from "./cats/cats.module.js";

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      useFactory: async () => ({
        typePaths: [join(__dirname, "**", "*.graphql")],
        useGlobalPrefix: true,
      }),
    }),
  ],
})
export class GlobalPrefixAsyncOptionsModule {}
