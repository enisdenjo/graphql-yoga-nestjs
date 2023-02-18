import { afterAll, beforeAll, it } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './fixtures/graphql/app.module';
import { gqlf } from './utils/gqlf';

let app: INestApplication;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = module.createNestApplication();
  await app.listen(0);
});

afterAll(() => app.close());

it('should return query result', async ({ expect }) => {
  const res = await gqlf(app, {
    query: /* GraphQL */ `
      {
        getCats {
          id
          color
          weight
        }
      }
    `,
  });
  await expect(res.json()).resolves.toMatchInlineSnapshot(`
    {
      "data": {
        "getCats": [
          {
            "color": "black",
            "id": 1,
            "weight": 5,
          },
        ],
      },
    }
  `);
});
