/**
 * 基类
 */
export interface Base {
  /** 插件包名 */
  name: string
  /**
   * 插件类型
   * - npm: npm 插件
   * - git: git 插件
   * - app: 单应用插件
   */
  type: 'npm' | 'git' | 'app'
  /** 插件描述 限制 50 长度 */
  description: string
  /** 插件提交到仓库时间 */
  time: string
  /** 插件许可证 */
  license: {
    /** 许可证名称 */
    name: string
    /** 许可证地址 */
    url: string
  }
  /** 插件作者 */
  author: {
    /** 名字 */
    name: string
    /** 主页 */
    home: string
  }[]
  /** 插件仓库 */
  repo: {
    /** 仓库类型 */
    type: 'github' | 'gitee' | 'gitcode' | 'gitlab' | 'npm'
    /** 仓库地址 */
    url: string
  }[]
}

/**
 * npm 插件类型
 */
export interface Npm extends Base {
  type: 'npm'
}

/**
 * git 插件类型
 */
export interface Git extends Base {
  type: 'git'
}

/**
 * 单应用插件类型
 */
export interface App extends Base {
  type: 'app'
  /** app文件直链 */
  files: string[]
}
