import { GraphQLSchema, lexicographicSortSchema } from 'graphql';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { YogaDriver } from '../../src/drivers/index.js';
import { YogaDriverConfig } from '../../src/index.js';
import { DirectionsModule } from '../code-first/directions/directions.module.js';
import { RecipesModule } from '../code-first/recipes/recipes.module.js';

@Module({
  imports: [
    RecipesModule,
    DirectionsModule,
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      autoSchemaFile: 'schema.graphql',
      transformSchema: (schema: GraphQLSchema) => lexicographicSortSchema(schema),
      transformAutoSchemaFile: true,
    }),
  ],
})
export class TransformAutoSchemaFileModule {}
