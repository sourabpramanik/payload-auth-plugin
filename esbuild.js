import * as esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import path from 'path'
import { fileURLToPath } from 'url'
import CssModulesPlugin from 'esbuild-css-modules-plugin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const build = async () => {
  esbuild.build({
    entryPoints: ['src/index.ts'],
    format: 'esm',
    bundle: true,
    outdir: 'dist',
    packages: 'external',
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    sourcemap: true,
    plugins: [
      nodeExternalsPlugin(),
      CssModulesPlugin({
        force: true,
        emitDeclarationFile: true,
        localsConvention: 'camelCaseOnly',
        namedExports: true,
        inject: false,
      }),
    ],
  })
  esbuild.build({
    entryPoints: ['src/providers/index.ts'],
    bundle: true,
    format: 'esm',
    outdir: 'dist/src/providers',
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    sourcemap: true,
  })
}

await build()
