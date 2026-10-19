#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { convert } from '../src/convert.js'

const args = process.argv.slice(2)
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`Usage: config-converter <input.conf> [-o out.xml]

Convert a simple vendor-style config into XML.
Built with Launchpad (idea → production teaching workflow).
`)
  process.exit(args.length === 0 ? 1 : 0)
}

const inputPath = args[0]
const outIdx = args.indexOf('-o')
const outPath = outIdx >= 0 ? args[outIdx + 1] : null

const input = readFileSync(inputPath, 'utf8')
const xml = convert(input)

if (outPath) {
  writeFileSync(outPath, xml, 'utf8')
  console.log(`✓ wrote ${outPath}`)
} else {
  process.stdout.write(xml)
}
