import { INestApplication } from '@nestjs/common';
import { fetch } from '@whatwg-node/fetch';

export interface GQLFParams {
  operationName?: string | undefined;
  query: string;
  variables?: Record<string, unknown> | undefined;
  extensions?: Record<string, unknown> | undefined;
}

export interface GQLFOptions {
  /** @default /graphql */
  endpoint?: string;
}

export async function gqlf(app: INestApplication, params: GQLFParams, opts: GQLFOptions = {}) {
  const { endpoint = '/graphql' } = opts;
  const url = await app.getUrl();
  return await fetch(url + endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}
