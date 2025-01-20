/**
 * 插件类型
 */
export interface Plugin {
    /** 插件名称 */
    name: string
    /** 插件包名 */
    package_name: string
    /** 插件类型 */
    type: 'npm' | 'git' | 'app'
    /** 插件描述 */
    description: string
    /** 插件许可证 */
    license: string
    /** 提交到本仓库时间 格式：YYYY-MM-DD HH:mm:ss */
    time: string
    /**
     * 安装命令
     * 
     * - 如果是 `npm` 类型 无需填写
     * - 如果是 `git` 类型 填写 `git clone --depth=1 仓库地址 ./plugins/${package_name}`
     * - 如果是 `app` 类型 请填写文件直链 请优先使用国内源
     */
    install_command?: string
    /** 插件作者 */
    author: {
      /** 作者名称 */
      name: string
      /** 作者主页 */
      home: string
      /** 作者邮箱 */
      email?: string
    }[],
    /** 插件仓库源 */
    repo: {
      /** 仓库源: `github` | `gitee` | `gitlab` | `gitcode` */
      type: string
      /** 仓库源地址 */
      url: string
      /** 备注 */
      remark?: string
    }[]
  }
  