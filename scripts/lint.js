import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const roots = ['src', 'bin', 'test']
let files = 0
const banned = ['ev' + 'al(']

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.js')) {
      const src = readFileSync(p, 'utf8')
      for (const bad of banned) {
        if (src.includes(bad)) {
          console.error('lint fail:', bad, 'in', p)
          process.exit(1)
        }
      }
      files++
    }
  }
}

for (const r of roots) {
  try {
    walk(r)
  } catch {
    /* missing folder ok during early scaffold */
  }
}

console.log(`✓ No lint errors (${files} files checked)`)
