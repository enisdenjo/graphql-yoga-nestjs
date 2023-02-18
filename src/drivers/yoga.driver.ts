// @ts-nocheck
import { printSchema } from 'graphql';
import type { ExecutionParams } from 'subscriptions-transport-ws';
import { Injectable } from '@nestjs/common';
import { GqlSubscriptionService, SubscriptionConfig } from '@nestjs/graphql';
import { YogaDriverConfig } from '../interfaces/index.js';
import { YogaBaseDriver } from './yoga-base.driver.js';

@Injectable()
export class YogaDriver extends YogaBaseDriver {
  private _subscriptionService?: GqlSubscriptionService;

  public async start(options: YogaDriverConfig) {
    const opts = await this.graphQlFactory.mergeWithSchema<YogaDriverConfig>(options);

    if (opts.definitions?.path) {
      await this.graphQlFactory.generateDefinitions(printSchema(opts.schema), opts);
    }

    await super.start(opts);

    if (opts.installSubscriptionHandlers || opts.subscriptions) {
      const subscriptionsOptions: SubscriptionConfig = opts.subscriptions || {
        'subscriptions-transport-ws': {},
      };
      if (
        subscriptionsOptions['graphql-ws'] != null &&
        subscriptionsOptions['graphql-ws'] !== false
      ) {
        subscriptionsOptions['graphql-ws'] =
          typeof subscriptionsOptions['graphql-ws'] === 'object'
            ? subscriptionsOptions['graphql-ws']
            : {};
        subscriptionsOptions['graphql-ws'].onSubscribe = async (ctx, msg) => {
          const { schema, execute, subscribe, contextFactory, parse, validate } =
            this.yoga.getEnveloped({
              ...ctx,
              req: (ctx.extra as any).request,
              socket: (ctx.extra as any).socket,
              params: msg.payload,
            });

          const args = {
            schema,
            operationName: msg.payload.operationName,
            document: parse(msg.payload.query),
            variableValues: msg.payload.variables,
            contextValue: await contextFactory({ execute, subscribe }),
          };

          const errors = validate(args.schema, args.document);
          if (errors.length) return errors;
          return args;
        };
      }
      if (
        subscriptionsOptions['subscriptions-transport-ws'] != null &&
        subscriptionsOptions['subscriptions-transport-ws'] !== false
      ) {
        subscriptionsOptions['subscriptions-transport-ws'] =
          typeof subscriptionsOptions['subscriptions-transport-ws'] === 'object'
            ? subscriptionsOptions['subscriptions-transport-ws']
            : {};
        subscriptionsOptions['subscriptions-transport-ws'].onOperation = async (
          _msg: any,
          params: ExecutionParams,
          ws: WebSocket,
        ) => {
          const { schema, execute, subscribe, contextFactory, parse, validate } =
            this.yoga.getEnveloped({
              ...params.context,
              req:
                // @ts-expect-error upgradeReq does exist but is untyped
                ws.upgradeReq,
              socket: ws,
              params,
            });

          const args = {
            schema,
            operationName: params.operationName,
            document: typeof params.query === 'string' ? parse(params.query) : params.query,
            variables: params.variables,
            context: await contextFactory({ execute, subscribe }),
          };

          const errors = validate(args.schema, args.document);
          if (errors.length) return errors;
          return args;
        };
      }

      this._subscriptionService = new GqlSubscriptionService(
        {
          schema: opts.schema,
          path: opts.path,
          execute: (...args) => {
            const contextValue = args[3] || args[0].contextValue;
            return contextValue.execute(...args);
          },
          subscribe: (...args) => {
            const contextValue = args[3] || args[0].contextValue;
            return contextValue.subscribe(...args);
          },
          ...subscriptionsOptions,
        },
        this.httpAdapterHost.httpAdapter?.getHttpServer(),
      );
    }
  }

  public async stop() {
    await this._subscriptionService?.stop();
  }
}
