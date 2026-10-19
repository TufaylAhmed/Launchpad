import { mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

mkdirSync('dist', { recursive: true })
copyFileSync('src/convert.js', 'dist/convert.js')
copyFileSync('bin/cli.js', 'dist/cli.js')

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
writeFileSync(
  join('dist', 'BUILD_INFO.json'),
  JSON.stringify(
    { name: pkg.name, version: pkg.version, builtAt: new Date().toISOString() },
    null,
    2,
  ),
)

console.log('✓ dist/ written')
