import { Injectable } from '@nestjs/common';
import { NewRecipeInput } from './dto/new-recipe.input';
import { RecipesArgs } from './dto/recipes.args';
import { Recipe } from './models/recipe.model';

@Injectable()
export class RecipesService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create(_data: NewRecipeInput): Promise<Recipe> {
    return {} as any;
  }

  async findOneById(_id: string): Promise<Recipe> {
    return {} as any;
  }

  async findAll(_recipesArgs: RecipesArgs): Promise<Recipe[]> {
    return [] as Recipe[];
  }

  async remove(_id: string): Promise<boolean> {
    return true;
  }
}
