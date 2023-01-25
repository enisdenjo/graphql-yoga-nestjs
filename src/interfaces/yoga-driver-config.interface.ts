import { YogaServerOptions } from 'graphql-yoga';
import {
  GqlModuleAsyncOptions,
  GqlModuleOptions,
  GqlOptionsFactory,
  SubscriptionConfig,
} from '@nestjs/graphql';

export type YogaDriverSubscriptionConfig = Omit<
  SubscriptionConfig,
  'graphql-ws' | 'subscriptions-transport-ws'
> & {
  'graphql-ws'?: Omit<SubscriptionConfig['graphql-ws'], 'onSubscribe'>;
  'subscriptions-transport-ws'?: Omit<
    SubscriptionConfig['subscriptions-transport-ws'],
    'onOperation'
  >;
};

export interface YogaDriverConfig
  extends GqlModuleOptions,
    // eslint-disable-next-line @typescript-eslint/ban-types
    Omit<YogaServerOptions<{}, {}>, 'context' | 'schema'> {
  /**
   * If enabled, "subscriptions-transport-ws" will be automatically registered.
   */
  installSubscriptionHandlers?: boolean;

  /**
   * Subscriptions configuration.
   */
  subscriptions?: YogaDriverSubscriptionConfig;
}

export type YogaDriverConfigFactory = GqlOptionsFactory<YogaDriverConfig>;
export type YogaDriverAsyncConfig = GqlModuleAsyncOptions<YogaDriverConfig>;
