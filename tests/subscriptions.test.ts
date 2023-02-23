import { afterAll, beforeAll, it } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AbortController } from '@whatwg-node/fetch';
import { AppModule } from './fixtures/graphql/app.module';
import { gqlf } from './utils/gqlf';

let app: INestApplication;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule.forRoot()],
  }).compile();
  app = module.createNestApplication();
  await app.listen(0);
});

afterAll(() => app.close());

it('should subscribe using sse', async ({ expect }) => {
  const ctrl = new AbortController();
  const sub = await gqlf(
    app,
    {
      query: /* GraphQL */ `
        subscription {
          catCreated {
            name
          }
        }
      `,
    },
    { signal: ctrl.signal },
  );
  let data = '';
  (async () => {
    for await (const chunk of sub.body!) {
      data += chunk.toString();
    }
  })().catch(() => {
    // noop
  });

  const mut = await gqlf(app, {
    query: /* GraphQL */ `
      mutation {
        createCat(name: "Dog") {
          name
        }
      }
    `,
  });

  await expect(mut.json()).resolves.toMatchInlineSnapshot(`
    {
      "data": {
        "createCat": {
          "name": "Dog",
        },
      },
    }
  `);

  // let the subscriptions flush
  await new Promise(resolve => setTimeout(resolve, 0));

  ctrl.abort();

  expect(data).toMatchInlineSnapshot(`
    ":

    data: {\\"data\\":{\\"catCreated\\":{\\"name\\":\\"Dog\\"}}}

    "
  `);
});
