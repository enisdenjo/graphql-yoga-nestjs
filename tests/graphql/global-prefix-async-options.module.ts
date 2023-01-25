import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '../../src/index.js';
import { CatsModule } from './cats/cats.module.js';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      useFactory: async () => ({
        typePaths: [join(__dirname, '**', '*.graphql')],
        useGlobalPrefix: true,
      }),
    }),
  ],
})
export class GlobalPrefixAsyncOptionsModule {}
