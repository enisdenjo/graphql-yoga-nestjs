import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // esbuild does not fully support decorators and
  // therefore cannot be used for testing nestjs
  // https://github.com/nestjs/nest/issues/9228
  // https://github.com/vitest-dev/vitest/issues/708
  plugins: [swc.vite()],
});
