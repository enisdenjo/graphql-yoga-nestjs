import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '../../src/index.js';
import { CatsModule } from './cats/cats.module.js';
import { ConfigModule } from './config.module.js';
import { ConfigService } from './config.service.js';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
  ],
})
export class AsyncExistingApplicationModule {}
