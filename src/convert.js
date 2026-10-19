/**
 * Convert a simple vendor-style key=value config into a tiny XML document.
 * Lines look like:  set address obj1 10.0.0.1
 *                   set zone wan trust
 */
export function convert(input) {
  const lines = String(input)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))

  const addresses = []
  const zones = []

  for (const line of lines) {
    const addr = line.match(/^set\s+address\s+(\S+)\s+(\S+)/i)
    if (addr) {
      addresses.push({ name: addr[1], ip: addr[2] })
      continue
    }
    const zone = line.match(/^set\s+zone\s+(\S+)\s+(\S+)/i)
    if (zone) {
      zones.push({ name: zone[1], network: zone[2] })
    }
  }

  const addrXml = addresses
    .map(
      (a) =>
        `  <address name="${escapeXml(a.name)}">\n    <ip-netmask>${escapeXml(a.ip)}</ip-netmask>\n  </address>`,
    )
    .join('\n')

  const zoneXml = zones
    .map(
      (z) =>
        `  <zone name="${escapeXml(z.name)}">\n    <network>${escapeXml(z.network)}</network>\n  </zone>`,
    )
    .join('\n')

  return `<?xml version="1.0"?>
<config>
  <addresses>
${addrXml || '  <!-- none -->'}
  </addresses>
  <zones>
${zoneXml || '  <!-- none -->'}
  </zones>
</config>
`
}

function escapeXml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
