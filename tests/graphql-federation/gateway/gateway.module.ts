import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { YogaGatewayDriverConfig } from "../../../src";
import { YogaGatewayDriver } from "../../../src/drivers";

@Module({
  imports: [
    GraphQLModule.forRoot<YogaGatewayDriverConfig>({
      driver: YogaGatewayDriver,
      gateway: {
        debug: false,
        serviceList: [
          { name: "users", url: "http://localhost:3001/graphql" },
          { name: "posts", url: "http://localhost:3002/graphql" },
        ],
      },
    }),
  ],
})
export class AppModule {}
