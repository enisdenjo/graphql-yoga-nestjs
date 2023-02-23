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
  const sub = await gqlf(app, {
    query: /* GraphQL */ `
      subscription {
        greetings
      }
    `,
  });

  await expect(sub.text()).resolves.toMatchInlineSnapshot(`
    "data: {\\"data\\":{\\"greetings\\":\\"Hi\\"}}

    data: {\\"data\\":{\\"greetings\\":\\"Bonjour\\"}}

    data: {\\"data\\":{\\"greetings\\":\\"Hola\\"}}

    data: {\\"data\\":{\\"greetings\\":\\"Ciao\\"}}

    data: {\\"data\\":{\\"greetings\\":\\"Zdravo\\"}}

    "
  `);
});
