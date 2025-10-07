import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  cjsInterop: true,
  clean: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
});
