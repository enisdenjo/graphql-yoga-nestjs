import { join } from 'path';
import { DynamicModule, Inject, Module, Provider, Scope } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver } from '../../../src/drivers/index.js';
import { YogaDriverConfig } from '../../../src/index.js';
import { HelloResolver } from './hello.resolver.js';
import { HelloService } from './hello.service.js';
import { UsersService } from './users/users.service.js';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      typePaths: [join(__dirname, '*.graphql')],
    }),
  ],
  providers: [
    HelloResolver,
    HelloService,
    UsersService,
    {
      provide: 'REQUEST_ID',
      useFactory: () => 1,
      scope: Scope.REQUEST,
    },
  ],
})
export class HelloModule {
  constructor(@Inject('META') private readonly meta) {}

  static forRoot(meta: Provider): DynamicModule {
    return {
      module: HelloModule,
      providers: [meta],
    };
  }
}
