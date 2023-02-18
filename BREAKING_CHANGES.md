# @graphql-yoga/nestjs@v1

- No more `subscriptionWithFilter` in YogaBaseDriver.
- `YogaBaseDriver.yogaInstance` has been renamed to `YogaBaseDriver.yoga`
- `@apollo/gateway` peer dependency is now ^2.0.0
- `@apollo/subgraph` peer dependency is now ^2.0.0
- `graphql-yoga` is now a peer dependency
- Drop `@envelop/apollo-server-errors`, if you want to use it - supply it to the plugins yourself
