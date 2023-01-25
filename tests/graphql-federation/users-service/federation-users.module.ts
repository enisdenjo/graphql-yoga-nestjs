import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaFederationDriver, YogaFederationDriverConfig } from '../../../src/index.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaFederationDriverConfig>({
      driver: YogaFederationDriver,
      logging: true,
      typePaths: [join(__dirname, '**/*.graphql')],
    }),
    UsersModule,
  ],
})
export class AppModule {}
