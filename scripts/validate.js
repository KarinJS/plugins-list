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
  const requiredFields = ['name', 'package_name', 'type', 'description', 'license', 'time', 'author', 'repo']

  for (const field of requiredFields) {
    if (!plugin[field]) {
      throw new Error(`插件 ${plugin.package_name || '未知'} 缺少必填字段: ${field}`)
    }
  }

  if (!isValidTimeFormat(plugin.time)) {
    throw new Error(`插件 ${plugin.package_name} 的时间格式不正确，应为 YYYY-MM-DD HH:mm:ss`)
  }

  if (!Array.isArray(plugin.author) || plugin.author.length === 0) {
    throw new Error(`插件 ${plugin.package_name} 的作者信息格式不正确`)
  }

  if (!Array.isArray(plugin.repo) || plugin.repo.length === 0) {
    throw new Error(`插件 ${plugin.package_name} 的仓库信息格式不正确`)
  }
}

/**
 * 验证作者信息
 * @param {object} plugin 
 */
const validateAuthor = (plugin) => {
  for (const author of plugin.author) {
    if (!author.name) {
      throw new Error(`插件 ${plugin.package_name} 的作者缺少名称`)
    }
    if (!author.home || !isValidUrl(author.home)) {
      throw new Error(`插件 ${plugin.package_name} 的作者主页 URL 无效`)
    }
    if (author.email && !author.email.includes('@')) {
      throw new Error(`插件 ${plugin.package_name} 的作者邮箱格式无效`)
    }
  }
}

/**
 * 验证仓库信息
 * @param {object} plugin 
 */
const validateRepo = (plugin) => {
  const validTypes = ['github', 'gitee', 'gitlab', 'gitcode']

  for (const repo of plugin.repo) {
    if (!validTypes.includes(repo.type)) {
      throw new Error(`插件 ${plugin.package_name} 的仓库类型 ${repo.type} 无效`)
    }
    if (!repo.url || !isValidUrl(repo.url)) {
      throw new Error(`插件 ${plugin.package_name} 的仓库 URL 无效`)
    }
  }
}

/**
 * 验证 Git 类型插件
 * @param {object} plugin 
 */
const validateGitPlugin = (plugin) => {
  if (!plugin.install_command) {
    throw new Error(`Git 类型插件 ${plugin.package_name} 缺少 install_command`)
  }

  const commandPattern = new RegExp(`git clone --depth=1 .+ ./plugins/${plugin.package_name}$`)
  if (!commandPattern.test(plugin.install_command)) {
    throw new Error(`Git 类型插件 ${plugin.package_name} 的 install_command 格式不正确`)
  }
}

/**
 * 验证 App 类型插件
 * @param {object} plugin 
 */
const validateAppPlugin = (plugin) => {
  if (!plugin.install_command) {
    throw new Error(`App 类型插件 ${plugin.package_name} 缺少 install_command`)
  }

  if (!isValidUrl(plugin.install_command)) {
    throw new Error(`App 类型插件 ${plugin.package_name} 的 install_command 必须是有效的 URL`)
  }
}

/**
 * 验证插件列表中的包名是否唯一
 * @param {object[]} plugins 
 */
const validateUniquePackages = (plugins) => {
  const packageNames = new Set()
  for (const plugin of plugins) {
    if (packageNames.has(plugin.package_name)) {
      throw new Error(`发现重复的 package_name: ${plugin.package_name}`)
    }
    packageNames.add(plugin.package_name)
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

      switch (plugin.type) {
        case 'npm':
          if (plugin.install_command) {
            throw new Error(`NPM 类型插件 ${plugin.package_name} 不需要 install_command`)
          }
          break
        case 'git':
          validateGitPlugin(plugin)
          break
        case 'app':
          validateAppPlugin(plugin)
          break
        default:
          throw new Error(`插件 ${plugin.package_name} 的类型 ${plugin.type} 无效`)
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