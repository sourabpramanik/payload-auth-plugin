import * as esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const sharedBuildConfig = {
  format: 'esm',
  bundle: true,
  sourcemap: true,
  metafile: true,
  tsconfig: path.resolve(dirname, './tsconfig.json'),
  plugins: [nodeExternalsPlugin()],
}

async function build() {
  await esbuild.build({
    ...sharedBuildConfig,
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
  })
  await esbuild.build({
    ...sharedBuildConfig,
    entryPoints: ['src/providers/index.ts'],
    outdir: 'dist/providers',
  })
  await esbuild.build({
    ...sharedBuildConfig,
    entryPoints: ['src/client/index.ts'],
    outdir: 'dist/client',
  })
}

await build()
