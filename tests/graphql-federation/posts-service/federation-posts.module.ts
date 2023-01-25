import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaFederationDriver } from '../../../src/drivers/index.js';
import { YogaDriverConfig } from '../../../src/index.js';
import { PostsModule } from './posts/posts.module.js';
import { upperDirectiveTransformer } from './posts/upper.directive.js';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaFederationDriver,
      typePaths: [join(__dirname, '**/*.graphql')],
      logging: true,
      transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
    }),
    PostsModule,
  ],
})
export class AppModule {}
