/**
 * 此文件禁止修改
 */

import fs from 'node:fs'
import path from 'node:path'
import list from './list'

const JSON_PATH = path.resolve(__dirname, 'plugins.json')

const data = JSON.stringify(list, null, 2)
fs.writeFileSync(JSON_PATH, data)

console.log('plugins.json 文件已生成')
