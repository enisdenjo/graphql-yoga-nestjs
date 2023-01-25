import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import {
  YogaGatewayDriverConfig,
  YogaGatewayDriver,
} from "../../../src/index.js";
import { ConfigModule } from "./config/config.module.js";
import { ConfigService } from "./config/config.service.js";

@Module({
  imports: [
    GraphQLModule.forRootAsync<YogaGatewayDriverConfig>({
      driver: YogaGatewayDriver,
      useClass: ConfigService,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
