/**
 * 此文件禁止修改
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOURCE_JSON = path.join(__dirname, 'plugins.json.json')
const TARGET_JSON = path.join(__dirname, '..', 'plugins.json')

const pluginsList = JSON.parse(fs.readFileSync(SOURCE_JSON, 'utf-8'))
const data = JSON.stringify(pluginsList.plugins, null, 2)
fs.writeFileSync(TARGET_JSON, data)

console.log('plugins.json 文件已生成') 