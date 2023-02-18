import { Injectable } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { GraphQLFederationFactory } from '@nestjs/graphql';
import { YogaFederationDriverConfig } from '../interfaces/index';
import { YogaBaseDriver } from './yoga-base.driver';

@Injectable()
export class YogaFederationDriver extends YogaBaseDriver<YogaFederationDriverConfig> {
  constructor(private readonly graphqlFederationFactory: GraphQLFederationFactory) {
    super();
  }

  public async start(options: YogaFederationDriverConfig) {
    const opts = await this.graphqlFederationFactory.mergeWithSchema(options);

    if (options.definitions?.path) {
      const { printSubgraphSchema } = loadPackage('@apollo/subgraph', 'ApolloFederation', () =>
        require('@apollo/subgraph'),
      );
      await this.graphQlFactory.generateDefinitions(printSubgraphSchema(opts.schema), options);
    }

    await super.start(opts);

    if (options.installSubscriptionHandlers || options.subscriptions) {
      // TL;DR <https://github.com/apollographql/apollo-server/issues/2776>
      throw new Error('No support for subscriptions yet when using Apollo Federation');
    }
  }
}
