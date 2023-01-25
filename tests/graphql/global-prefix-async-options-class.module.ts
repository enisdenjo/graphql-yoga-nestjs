import { join } from 'path';
import { Module } from '@nestjs/common';
import { GqlOptionsFactory, GraphQLModule } from '@nestjs/graphql';
import { YogaDriver, YogaDriverConfig } from '../../src/index.js';
import { CatsModule } from './cats/cats.module.js';

class ConfigService implements GqlOptionsFactory {
  createGqlOptions(): YogaDriverConfig {
    return {
      typePaths: [join(__dirname, '**', '*.graphql')],
      useGlobalPrefix: true,
    };
  }
}

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      useClass: ConfigService,
    }),
  ],
})
export class GlobalPrefixAsyncOptionsClassModule {}
