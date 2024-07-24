import * as esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function build() {
  await esbuild.build({
    entryPoints: ['src/index.ts', 'src/providers/index.ts'],
    outdir: 'dist/src',
    format: 'esm',
    bundle: true,
    sourcemap: true,
    metafile: true,
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    plugins: [nodeExternalsPlugin()],
  })
}

await build()
