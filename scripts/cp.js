import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import { fileURLToPath } from 'node:url'

/**
 * 复制`plugins.json`到`package.json`
 */
const main = () => {
  const dir = fileURLToPath(new URL('..', import.meta.url))
  const source = path.join(dir, 'plugins.json')
  const target = path.join(dir, 'package.json')

  const sourceData = JSON.parse(fs.readFileSync(source, 'utf-8'))
  const targetData = JSON.parse(fs.readFileSync(target, 'utf-8'))

  targetData.plugins = sourceData.plugins
  fs.writeFileSync(target, JSON.stringify(targetData, null, 2))
  console.log('[karinjs/plugins-list] success')
}

main()
