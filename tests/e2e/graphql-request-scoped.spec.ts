import { join } from 'path';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { YogaDriver } from '../../src/drivers/index.js';
import { YogaDriverConfig } from '../../src/index.js';
import { CatsRequestScopedService } from '../graphql/cats/cats-request-scoped.service.js';
import { CatsModule } from '../graphql/cats/cats.module.js';

describe('GraphQL request scoped', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        CatsModule.enableRequestScope(),
        GraphQLModule.forRoot<YogaDriverConfig>({
          driver: YogaDriver,
          typePaths: [join(__dirname, '..', 'graphql', '**', '*.graphql')],
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const performHttpCall = end =>
      request(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: null,
          variables: {},
          query: '{\n  getCats {\n    id\n  }\n}\n',
        })
        .expect(200, {
          data: {
            getCats: [
              {
                id: 1,
              },
            ],
          },
        })
        .end((err, res) => {
          if (err) return end(err);
          end();
        });

    await new Promise(resolve => performHttpCall(resolve));
    await new Promise(resolve => performHttpCall(resolve));
    await new Promise(resolve => performHttpCall(resolve));
  });

  it(`should create resolver for each incoming request`, () => {
    expect(CatsRequestScopedService.COUNTER).toEqual(3);
  });

  afterEach(async () => {
    await app.close();
  });
});
