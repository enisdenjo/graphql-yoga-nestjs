import { Injectable } from "@nestjs/common";
import { GqlSubscriptionService, SubscriptionConfig } from "@nestjs/graphql";
import { printSchema } from "graphql";

import { YogaDriverConfig } from "../interfaces/index.js";
import { YogaBaseDriver } from "./yoga-base.driver.js";
import type { ExecutionParams } from "subscriptions-transport-ws";

@Injectable()
export class YogaDriver extends YogaBaseDriver {
  private _subscriptionService?: GqlSubscriptionService;

  public async start(yogaOptions: YogaDriverConfig) {
    const options = await this.graphQlFactory.mergeWithSchema<YogaDriverConfig>(
      yogaOptions
    );

    if (options.definitions && options.definitions.path) {
      await this.graphQlFactory.generateDefinitions(
        printSchema(options.schema),
        options
      );
    }

    await super.start(options);

    if (options.installSubscriptionHandlers || options.subscriptions) {
      const subscriptionsOptions: SubscriptionConfig = options.subscriptions || {
        "subscriptions-transport-ws": {},
      };
      if (
        subscriptionsOptions["graphql-ws"] != null &&
        subscriptionsOptions["graphql-ws"] !== false
      ) {
        subscriptionsOptions["graphql-ws"] =
          typeof subscriptionsOptions["graphql-ws"] === "object"
            ? subscriptionsOptions["graphql-ws"]
            : {};
        subscriptionsOptions["graphql-ws"].onSubscribe = async (ctx, msg) => {
          const {
            schema,
            execute,
            subscribe,
            contextFactory,
            parse,
            validate,
          } = this.yogaInstance.getEnveloped(ctx);

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
        subscriptionsOptions["subscriptions-transport-ws"] != null &&
        subscriptionsOptions["subscriptions-transport-ws"] !== false
      ) {
        subscriptionsOptions["subscriptions-transport-ws"] =
          typeof subscriptionsOptions["subscriptions-transport-ws"] === "object"
            ? subscriptionsOptions["subscriptions-transport-ws"]
            : {};
        subscriptionsOptions["subscriptions-transport-ws"].onOperation = async (
          _msg: any,
          params: ExecutionParams
        ) => {
          const {
            schema,
            execute,
            subscribe,
            contextFactory,
            parse,
            validate,
          } = this.yogaInstance.getEnveloped(params.context);

          const args = {
            schema,
            operationName: params.operationName,
            document:
              typeof params.query === "string"
                ? parse(params.query)
                : params.query,
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
          schema: options.schema,
          path: options.path,
          execute: (...args) => {
            const contextValue = args[0].contextValue as any;
            return contextValue.execute(...args);
          },
          subscribe: (...args) => {
            const contextValue = args[0].contextValue as any;
            return contextValue.subscribe(...args);
          },
          ...subscriptionsOptions,
        },
        this.httpAdapterHost.httpAdapter?.getHttpServer()
      );
    }
  }

  public async stop() {
    await this._subscriptionService?.stop();
  }
}
