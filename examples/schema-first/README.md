## GraphQL Standalone API - Schema First
A simple example of a GraphQL server built with GraphQL Yoga using the Schema First approach.


<p>&nbsp;</p>

## Quick Start

<br/>

To regenerate or generate the TypeScript typings, please run `yarn generate`.


<br/>


To get up and running:

```sh
yarn

yarn start
```

Then, open your favorite browser at [http://localhost:3000/graphql](http://localhost:3000/graphql), and try the following query:

```gql
{
  cats {
    id
    name
    owner {
      id
      name
    }
  }
}
```
