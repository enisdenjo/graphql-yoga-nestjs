import { join } from 'path';
import { GraphQLDefinitionsFactory } from '@nestjs/graphql';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.schema.ts'),
  outputAs: 'class',
});
