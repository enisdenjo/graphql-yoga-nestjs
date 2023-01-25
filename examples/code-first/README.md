## GraphQL Standalone API - Code First

A simple example of a GraphQL server built with GraphQL Yoga using the Code First approach.

<p>&nbsp;</p>

## Quick Start

<br/>

To get up and running

```sh
yarn

yarn start
```

Then, open your favorite browser at [http://localhost:3000/graphql](http://localhost:3000/graphql),
and try the following query:

```gql
{
  recipes {
    id
    description
  }
}
```

To add some data, feel free to edit the `sample/34-graphql-yoga/src/recipes/recipes.resolver.ts`
file.
