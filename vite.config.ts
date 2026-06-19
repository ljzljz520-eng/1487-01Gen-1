import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  if (isLib) {
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          outDir: 'dist',
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'TableAnalyticsKit',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
        cssCodeSplit: false,
        sourcemap: true,
      },
    }
  }

  return {
    plugins: [react()],
    root: 'examples',
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: '../dist-demo',
      emptyOutDir: true,
    },
  }
})
