import { afterAll, beforeAll, it } from 'vitest';
import { IntrospectAndCompose } from '@apollo/gateway';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { YogaGatewayDriver, YogaGatewayDriverConfig } from '../src/federation';
import { PostsModule } from './fixtures/federation/posts/posts.module';
import { UsersModule } from './fixtures/federation/users/users.module';

const apps = {
  users: null as INestApplication | null,
  posts: null as INestApplication | null,
  gateway: null as INestApplication | null,
  gatewayUrl: null as string | null,
};

beforeAll(async () => {
  // users subgraph
  {
    const module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();
    apps.users = module.createNestApplication();
    await apps.users.listen(0);
  }

  // posts subgraph
  {
    const module = await Test.createTestingModule({
      imports: [PostsModule],
    }).compile();
    apps.posts = module.createNestApplication();
    await apps.posts.listen(0);
  }

  // gateway
  const module = await Test.createTestingModule({
    imports: [
      GraphQLModule.forRoot<YogaGatewayDriverConfig>({
        driver: YogaGatewayDriver,
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'users',
                url: (await apps.users.getUrl()) + '/graphql',
              },
              {
                name: 'posts',
                url: (await apps.posts.getUrl()) + '/graphql',
              },
            ],
          }),
        },
      }),
    ],
  }).compile();
  apps.gateway = module.createNestApplication();
  await apps.gateway.listen(0);
  apps.gatewayUrl = (await apps.gateway.getUrl()) + '/graphql';
});

afterAll(async () => {
  await Promise.all([apps.users?.close(), apps.posts?.close(), apps.gateway?.close()]);
});

it.todo('should have a working gateway', () => {});
