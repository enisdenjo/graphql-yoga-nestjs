// @ts-nocheck
import type { ApolloGateway } from '@apollo/gateway';
import { useApolloFederation as useApolloFederationPlugin } from '@envelop/apollo-federation';
import { Injectable } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util.js';
import { YogaGatewayDriverConfig } from '../interfaces/index.js';
import { YogaBaseDriver } from './yoga-base.driver.js';

@Injectable()
export class YogaGatewayDriver extends YogaBaseDriver<YogaGatewayDriverConfig> {
  public async start(options: YogaGatewayDriverConfig) {
    const { ApolloGateway } = loadPackage('@apollo/gateway', 'YogaGatewayDriver', () =>
      require('@apollo/gateway'),
    );
    const { useApolloFederation } = loadPackage(
      '@envelop/apollo-federation',
      'YogaGatewayDriver',
      () => require('@envelop/apollo-federation'),
    ) as { useApolloFederation: typeof useApolloFederationPlugin };

    const { server: serverOpts = {}, gateway: gatewayOpts = {} } = options;
    const gateway: ApolloGateway = new ApolloGateway(gatewayOpts);

    await gateway.load();

    await super.start({
      ...serverOpts,
      plugins: [
        ...(serverOpts.plugins || []),
        useApolloFederation({
          gateway,
        }),
      ],
    } as any);
  }

  public async mergeDefaultOptions(options: Record<string, any>): Promise<Record<string, any>> {
    return {
      ...options,
      server: await super.mergeDefaultOptions(options?.server ?? {}),
    };
  }
}
