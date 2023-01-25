import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { YogaDriverConfig, YogaDriverConfigFactory } from '../../src/index.js';

@Injectable()
export class ConfigService implements YogaDriverConfigFactory {
  createGqlOptions(): YogaDriverConfig {
    return {
      typePaths: [join(__dirname, '**', '*.graphql')],
    };
  }
}
