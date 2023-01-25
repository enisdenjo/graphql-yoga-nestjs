import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AppModule } from '../graphql-federation/posts-service/federation-posts.module.js';

describe('GraphQL federation with fastify', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it(`should return query result`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
        {
          getPosts {
            id,
            title,
            body,
          }
        }`,
      })
      .expect(200, {
        data: {
          getPosts: [
            {
              id: '1',
              title: 'HELLO WORLD',
              body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            },
          ],
        },
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
