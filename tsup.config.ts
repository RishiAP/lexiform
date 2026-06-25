import { defineConfig, Options } from 'tsup';
import fs from 'fs/promises';

const commonConfig: Options = {
  format: ['esm', 'cjs'],
  target: 'es2022',
  dts: true,
  sourcemap: true,
  treeshake: true,
  skipNodeModulesBundle: true,
  esbuildPlugins: [
    {
      name: 'strip-use-client',
      setup(build) {
        build.onLoad({ filter: /\.(tsx|ts|jsx|js)$/ }, async (args) => {
          let contents = await fs.readFile(args.path, 'utf8');
          if (contents.includes('use client')) {
            contents = contents.replace(/['"]use client['"];?/g, '//use client');
          }
          return {
            contents,
            loader: args.path.endsWith('.tsx') ? 'tsx' : args.path.endsWith('.ts') ? 'ts' : 'js',
          };
        });
      },
    },
  ],
};

export default defineConfig([
  {
    ...commonConfig,
    entry: ['src/index.ts', 'src/excalidraw.ts', 'src/equations.ts'],
    clean: true,
    async onSuccess() {
      try {
        await fs.copyFile('dist/index.css', 'dist/styles.css');
        
        // Explicitly inject "use client" into the client entry points
        const files = [
          'dist/index.js', 'dist/index.cjs',
          'dist/excalidraw.js', 'dist/excalidraw.cjs',
          'dist/equations.js', 'dist/equations.cjs'
        ];
        
        for (const file of files) {
          const content = await fs.readFile(file, 'utf8');
          await fs.writeFile(file, '"use client";\n' + content);
        }
      } catch (e) {
        console.error("Failed to inject use client or copy styles:", e);
      }
    },
  },
  {
    ...commonConfig,
    entry: ['src/headless.ts'],
    clean: false,
  }
]);
