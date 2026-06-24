import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm', 'cjs'],
  target: 'es2022',
  dts: true,
  sourcemap: true,
  clean: true,
  skipNodeModulesBundle: true,
  // Keep CSS imports as side effects — consumers import styles manually
  esbuildOptions(options) {
    // keep default options
  }
});
