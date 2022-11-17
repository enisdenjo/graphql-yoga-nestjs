import { AbstractGraphQLDriver } from "@nestjs/graphql";

import { YogaDriverConfig } from "../interfaces/index.js";
import { useApolloServerErrors } from "@envelop/apollo-server-errors";
import { createAsyncIterator } from "../utils/async-iterator.util.js";
import { createYoga, YogaServerInstance } from "graphql-yoga";

export abstract class YogaBaseDriver<
  T extends YogaDriverConfig = YogaDriverConfig
> extends AbstractGraphQLDriver<T> {
  protected yogaInstance: YogaServerInstance<{}, {}>;

  public async start(options: T) {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const platformName = httpAdapter.getType();

    const opts = {
      ...options,
      plugins: [...(options.plugins || []), useApolloServerErrors()],
      // disable error masking by default
      maskedErrors: options.maskedErrors ? true : false,
      // disable graphiql in production
      graphiql:
        (options.graphiql === undefined &&
          process.env.NODE_ENV === "production") ||
        options.graphiql === false
          ? false
          : options.graphiql,
    };

    if (platformName === "express") {
      await this.registerExpress(opts);
    } else if (platformName === "fastify") {
      await this.registerFastify(opts);
    } else {
      throw new Error(`No support for current HttpAdapter: ${platformName}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async stop() {}

  protected async registerExpress(
    options: T,
    { preStartHook }: { preStartHook?: () => void } = {}
  ) {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const app = httpAdapter.getInstance();

    preStartHook?.();

    this.yogaInstance = createYoga(options);

    app.use(options.path, this.yogaInstance);
  }

  protected async registerFastify(
    options: T,
    { preStartHook }: { preStartHook?: () => void } = {}
  ) {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const app = httpAdapter.getInstance();

    preStartHook?.();

    this.yogaInstance = createYoga(options);

    app.route({
      url: options.path,
      method: ["GET", "POST", "OPTIONS"],
      handler: this.yogaInstance, // Not tested
    });
  }

  public subscriptionWithFilter(
    instanceRef: unknown,
    filterFn: (
      payload: any,
      variables: any,
      context: any
    ) => boolean | Promise<boolean>,
    createSubscribeContext: Function
  ) {
    return <TPayload, TVariables, TContext, TInfo>(
      ...args: [TPayload, TVariables, TContext, TInfo]
    ): any =>
      createAsyncIterator(createSubscribeContext()(...args), (payload: any) =>
        filterFn.call(instanceRef, payload, ...args.slice(1))
      );
  }
}
