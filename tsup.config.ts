import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Keep CSS imports as side effects — consumers import styles manually
  esbuildOptions(options) {
    // keep default options
  }
});
