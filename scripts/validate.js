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
  const requiredFields = ['name', 'type', 'description', 'license', 'time', 'author', 'repo', 'home']

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

  const type = ['git', 'npm', 'app']
  if (!type.includes(plugin.type)) {
    throw new Error(`插件 ${plugin.name} 的类型 ${plugin.type} 无效`)
  }

  if (!isValidUrl(plugin.home)) {
    throw new Error(`插件 ${plugin.name} 的主页 URL 无效`)
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
 * 获取仓库原始文件的URL
 * @param {object} repo - 仓库信息
 * @param {string} filePath - 文件路径
 * @returns {string} 原始文件URL
 */
const getRawFileUrl = (repo) => {
  const { type, url, branch } = repo
  const filePath = 'package.json'

  switch (type) {
    case 'github':
      return url.replace('github.com', 'raw.githubusercontent.com') + `/${branch}/${filePath}`
    case 'gitee':
      return `${url}/raw/${branch}/${filePath}`
    case 'gitlab':
      return `${url}/raw/${branch}/${filePath}`
    case 'gitcode':
      return `${url}/raw/${branch}/${filePath}`
    case 'npm':
      return `https://registry.npmjs.org/${url}/latest`
    default:
      throw new Error(`不支持的仓库类型: ${type}`)
  }
}

/**
 * 验证 npm 包是否存在
 * @param {object} repo - 仓库信息
 */
const validateNpmPackage = async (name) => {
  try {
    const response = await fetch(`https://registry.npmjs.com/${name}/latest`)
    if (!response.ok) {
      throw new Error(`npm 包不存在或无法访问: ${response.statusText}`)
    }
    const packageData = await response.json()
    if (!packageData.name || !packageData.version) {
      throw new Error('npm 包缺少 name 或 version 字段')
    }
  } catch (error) {
    throw new Error(`npm 包 ${name} 验证失败: ${error.message}`)
  }
}

/**
 * 验证仓库的 package.json
 * @param {object} plugin - 插件信息
 * @param {object} repo - 仓库信息
 */
const validatePackageJson = async (plugin, repo) => {
  try {
    if (plugin.type === 'app') {
      return // app 类型不需要验证 package.json
    }
    if (repo.type === 'npm') {
      // if (repo.branch !== '') {
      //   throw new Error(`插件 ${plugin.name} 的 npm 仓库不应该设置 branch 字段`)
      // }
      return // npm 类型不需要验证 package.json
    }

    if (!repo.branch) {
      throw new Error(`插件 ${plugin.name} 的 ${repo.type} 仓库缺少 branch 字段`)
    }

    const rawUrl = getRawFileUrl(repo)
    const response = await fetch(rawUrl)

    if (!response.ok) {
      throw new Error(`无法访问 package.json: ${response.statusText}`)
    }

    const packageJson = await response.json()

    if (!packageJson.name) {
      throw new Error('package.json 缺少 name 字段')
    }

    if (!packageJson.version) {
      throw new Error('package.json 缺少 version 字段')
    }
  } catch (error) {
    throw new Error(`插件 ${plugin.name} 的仓库 ${repo.url} 验证失败: ${error.message}`)
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

  for (const file of plugin.files) {
    if (!file.name) {
      throw new Error(`App 类型插件 ${plugin.name} 的文件缺少 name 字段`)
    }
    if (!isValidUrl(file.url)) {
      throw new Error(`App 类型插件 ${plugin.name} 的文件URL无效: ${file.url}`)
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

    // 并发验证所有插件
    await Promise.all(plugins.map(async (plugin) => {
      validateBaseFields(plugin)
      validateAuthor(plugin)
      validateRepo(plugin)

      // 并发验证所有仓库
      await Promise.all(plugin.repo.map(repo => validatePackageJson(plugin, repo)))

      if (plugin.type === 'app') {
        validateAppPlugin(plugin)
      } else if (plugin.type === 'git') {
        // 什么都不做
      } else if (plugin.type === 'npm') {
        await validateNpmPackage(plugin.name)
      } else {
        throw new Error(`插件 ${plugin.name} 的类型 ${plugin.type} 无效`)
      }
    }))

    console.log('✅ 验证通过')
    process.exit(0)
  } catch (error) {
    console.error('❌ 验证失败:', error.message)
    process.exit(1)
  }
}

main() 