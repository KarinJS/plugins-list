import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOURCE_JSON = path.join(__dirname, '..', 'plugins.json')

/**
 * 验证时间格式是否符合 YYYY-MM-DD HH:mm:ss
 * @param {string} time 
 */
const isValidTimeFormat = (time) => {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
  if (!regex.test(time)) return false

  const date = new Date(time.replace(' ', 'T'))
  return date instanceof Date && !isNaN(date)
}

/**
 * 验证 URL 格式
 * @param {string} url 
 */
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证插件基础字段
 * @param {object} plugin 
 */
const validateBaseFields = (plugin) => {
  const requiredFields = ['name', 'type', 'description', 'license', 'time', 'author', 'repo']

  for (const field of requiredFields) {
    if (!plugin[field]) {
      throw new Error(`插件 ${plugin.name || '未知'} 缺少必填字段: ${field}`)
    }
  }

  if (!isValidTimeFormat(plugin.time)) {
    throw new Error(`插件 ${plugin.name} 的时间格式不正确，应为 YYYY-MM-DD HH:mm:ss`)
  }

  if (plugin.description.length > 50) {
    throw new Error(`插件 ${plugin.name} 的描述长度超过50个字符`)
  }

  // 验证 license
  if (!plugin.license.name || !plugin.license.url || !isValidUrl(plugin.license.url)) {
    throw new Error(`插件 ${plugin.name} 的许可证信息不完整或URL无效`)
  }

  if (!Array.isArray(plugin.author) || plugin.author.length === 0) {
    throw new Error(`插件 ${plugin.name} 的作者信息格式不正确`)
  }

  if (!Array.isArray(plugin.repo) || plugin.repo.length === 0) {
    throw new Error(`插件 ${plugin.name} 的仓库信息格式不正确`)
  }

  const type = ['github', 'gitee', 'gitcode', 'gitlab', 'npm']
  if (!type.includes(plugin.type)) {
    throw new Error(`插件 ${plugin.name} 的类型 ${plugin.type} 无效`)
  }
}

/**
 * 验证作者信息
 * @param {object} plugin 
 */
const validateAuthor = (plugin) => {
  for (const author of plugin.author) {
    if (!author.name) {
      throw new Error(`插件 ${plugin.name} 的作者缺少名称`)
    }
    if (!author.home || !isValidUrl(author.home)) {
      throw new Error(`插件 ${plugin.name} 的作者主页 URL 无效`)
    }
  }
}

/**
 * 验证仓库信息
 * @param {object} plugin 
 */
const validateRepo = (plugin) => {
  const validTypes = ['github', 'gitee', 'gitlab', 'gitcode', 'npm']

  for (const repo of plugin.repo) {
    if (!validTypes.includes(repo.type)) {
      throw new Error(`插件 ${plugin.name} 的仓库类型 ${repo.type} 无效`)
    }
    if (!repo.url || !isValidUrl(repo.url)) {
      throw new Error(`插件 ${plugin.name} 的仓库 URL 无效`)
    }
  }
}

/**
 * 验证 App 类型插件
 * @param {object} plugin 
 */
const validateAppPlugin = (plugin) => {
  if (!Array.isArray(plugin.files) || plugin.files.length === 0) {
    throw new Error(`App 类型插件 ${plugin.name} 缺少 files 数组`)
  }

  for (const fileUrl of plugin.files) {
    if (!isValidUrl(fileUrl)) {
      throw new Error(`App 类型插件 ${plugin.name} 的文件URL无效: ${fileUrl}`)
    }
  }
}

/**
 * 验证插件列表中的包名是否唯一
 * @param {object[]} plugins 
 */
const validateUniquePackages = (plugins) => {
  const names = new Set()
  for (const plugin of plugins) {
    if (names.has(plugin.name)) {
      throw new Error(`发现重复的插件名称: ${plugin.name}`)
    }
    names.add(plugin.name)
  }
}

const main = async () => {
  try {
    const content = await fs.promises.readFile(SOURCE_JSON, 'utf-8')
    const { plugins } = JSON.parse(content)

    validateUniquePackages(plugins)

    for (const plugin of plugins) {
      validateBaseFields(plugin)
      validateAuthor(plugin)
      validateRepo(plugin)

      if (plugin.type === 'app') {
        validateAppPlugin(plugin)
      } else if (plugin.type === 'git' || plugin.type === 'npm') {
        // 什么都不做
      } else {
        throw new Error(`插件 ${plugin.name} 的类型 ${plugin.type} 无效`)
      }
    }

    console.log('✅ 验证通过')
    process.exit(0)
  } catch (error) {
    console.error('❌ 验证失败:', error.message)
    process.exit(1)
  }
}

main() 