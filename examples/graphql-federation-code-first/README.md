## GraphQL Federation API - Code First approach

A simple example of a GraphQL Federation setup built with GraphQL Yoga using the Code First approach.

<p>&nbsp;</p>

## Quick Start

<br/>

Start each API (gateway and posts and users services):

```sh
yarn

yarn start
```

Then, open your favorite browser at [http://localhost:3002/graphql](http://localhost:3002/graphql), and try the following query:

```gql
{
  posts {
    id
    title
    user {
      id
    }
  }
}
```
