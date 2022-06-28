import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { YogaDriverConfig } from "../../src.js";
import { YogaDriver } from "../../src/drivers.js";
import { CatsModule } from "./cats/cats.module.js";

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      typePaths: [join(__dirname, "**", "*.graphql")],
    }),
  ],
})
export class ApplicationModule {}
