# @graphql-yoga/nestjs@v1

- No more `subscriptionWithFilter` in YogaBaseDriver.
- `YogaBaseDriver.yogaInstance` has been renamed to `YogaBaseDriver.yoga`
- `@apollo/gateway` peer dependency is now ^2.0.0
- `@apollo/subgraph` peer dependency is now ^2.0.0
- `graphql-yoga` is now a peer dependency
- Drop `@envelop/apollo-server-errors`, if you want to use it - supply it to the plugins yourself
- `YogaBaseDriver` has been renamed to `AbstractYogaDriver`
- Optional federation drivers have been moved to `@graphql-yoga/nestjs/lib/federation`
- `@apollo/gateway` `@envelop/apollo-federation` are optional peer dependencies and have to be
  installed if federation drivers are used
- `installSubscriptionHandlers` driver option has been dropped, please use the `subscriptions`
  option
