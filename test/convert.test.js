import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { convert } from '../src/convert.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('convert', () => {
  it('parses fortinet-style addresses', () => {
    const xml = convert('set address web1 10.1.1.10')
    assert.match(xml, /name="web1"/)
    assert.match(xml, /10\.1\.1\.10/)
  })

  it('maps zones from fixture', () => {
    const input = readFileSync(join(root, 'fixtures/sample.conf'), 'utf8')
    const xml = convert(input)
    assert.match(xml, /name="wan"/)
    assert.match(xml, /untrust/)
  })

  it('matches golden XML', () => {
    const input = readFileSync(join(root, 'fixtures/sample.conf'), 'utf8')
    const golden = readFileSync(join(root, 'fixtures/golden.xml'), 'utf8')
    assert.equal(convert(input).trim(), golden.trim())
  })
})
