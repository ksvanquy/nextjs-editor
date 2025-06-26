import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  minify: true,
  target: 'es2020',
  outDir: 'dist',
  onSuccess: 'echo "Build completed successfully!"',
}) 