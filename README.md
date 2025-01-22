# Karin 插件仓库

这是 Karin 的官方插件仓库，用于收集和管理社区贡献的插件。

## 目录

- [插件列表](#插件列表)
- [提交插件](#提交插件)
- [插件规范](#插件规范)

## 插件列表

你可以在 [plugins.json](./plugins.json) 中查看所有可用的插件。

## 提交插件

### 前置条件

1. 确保你的插件已经发布到 npm
2. 确保你的插件遵循 [插件规范](#插件规范)
3. 准备好插件的相关信息

### 提交步骤

1. Fork 本仓库
2. 在 `src/list.ts` 文件中添加你的插件信息
3. 提交 Pull Request
4. 等待自动化检查和审核

### 插件信息格式

每个插件需要提供以下信息：

#### 必填字段

| 字段名       | 类型   | 描述                           | 示例                     |
| ------------ | ------ | ------------------------------ | ------------------------ |
| name         | string | 插件显示名称                   | "基础插件"               |
| package_name | string | npm 包名称                     | "karin-plugin-basic"     |
| type         | string | 插件类型                       | "npm"  \| "git" \| "app" |
| description  | string | 插件描述                       | "karin plugin basic"     |
| license      | string | 开源协议                       | "MIT"                    |
| time         | string | 发布时间 (YYYY-MM-DD HH:mm:ss) | "2025-01-19 10:00:00"    |

#### 作者信息 (author)

作者信息是一个数组，支持多个作者：

| 字段名 | 类型   | 描述     | 示例                         |
| ------ | ------ | -------- | ---------------------------- |
| name   | string | 作者名称 | "shijin"                     |
| email  | string | 作者邮箱 | "<shijin520@gmail.com>"      |
| home   | string | 作者主页 | "<https://github.com/sj817>" |

#### 仓库信息 (repo)

仓库信息是一个数组，支持多个仓库地址：

| 字段名 | 类型   | 描述                        | 示例                                              |
| ------ | ------ | --------------------------- | ------------------------------------------------- |
| type   | string | 仓库类型，目前支持 "github" | "github"                                          |
| url    | string | 仓库地址                    | "<https://github.com/karinjs/karin-plugin-basic>" |

### 示例

在 `src/plugins.json.json` 文件中的 `plugins` 数组末尾添加你的插件信息。以下是不同类型插件的示例：

```json
{
  "plugins": [
    // NPM 插件示例
    {
      "name": "NPM插件示例",
      "package_name": "karin-plugin-example",
      "type": "npm",
      "description": "这是一个 NPM 插件示例",
      "license": "MIT",
      "time": "2024-03-19 10:00:00",
      "author": [
        {
          "name": "作者名字",
          "email": "author@example.com",
          "home": "https://github.com/username"
        }
      ],
      "repo": [
        {
          "type": "github",
          "url": "https://github.com/username/karin-plugin-example"
        }
      ]
    },

    // Git 插件示例
    {
      "name": "Git插件示例",
      "package_name": "karin-plugin-git-example",
      "type": "git",
      "description": "这是一个 Git 插件示例",
      "license": "MIT",
      "time": "2024-03-19 10:00:00",
      "install_command": "git clone --depth=1 https://github.com/username/plugin-repo.git ./plugins/karin-plugin-git-example",
      "author": [
        {
          "name": "作者名字",
          "email": "author@example.com",
          "home": "https://github.com/username"
        }
      ],
      "repo": [
        {
          "type": "github",
          "url": "https://github.com/username/plugin-repo"
        }
      ]
    },

    // App 插件示例
    {
      "name": "App插件示例",
      "package_name": "karin-plugin-app-example",
      "type": "app",
      "description": "这是一个 App 插件示例",
      "license": "MIT",
      "time": "2024-03-19 10:00:00",
      "install_command": "https://example.com/download/plugin.zip",
      "author": [
        {
          "name": "作者名字",
          "email": "author@example.com",
          "home": "https://github.com/username"
        }
      ],
      "repo": [
        {
          "type": "github",
          "url": "https://github.com/username/app-plugin-repo",
          "remark": "源码仓库"
        },
        {
          "type": "gitee",
          "url": "https://gitee.com/username/app-plugin-repo",
          "remark": "国内镜像"
        }
      ]
    }
  ]
}
```

### 插件类型说明

1. **NPM 插件** (`type: "npm"`)
   - 直接通过 npm 安装
   - 无需提供 `install_command`

2. **Git 插件** (`type: "git"`)
   - 通过 git clone 安装
   - 需要提供 `install_command`，格式为：
     ```bash
     git clone --depth=1 仓库地址 ./plugins/${package_name}
     ```

3. **App 插件** (`type: "app"`)
   - 通过下载压缩包方式安装
   - 需要提供 `install_command`，填写文件直链地址
   - 建议提供国内外多个下载源

## 注意事项

- 请确保将新插件添加到 `plugins` 数组的末尾
- package_name 必须是唯一的
- 对于 App 类型插件，建议提供多个下载源以提高可用性

## 许可证

本仓库采用 MIT 许可证

## 预览

### github

```bash
https://raw.githubusercontent.com/KarinJS/files/refs/heads/main/plugins.json
```

### gitee

```bash
https://gitee.com/KarinJS/files/raw/main/plugins.json
```

### gitcode

```bash
https://raw.gitcode.com/karinjs/file/raw/main/plugins.json
```
