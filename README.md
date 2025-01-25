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

1. 确保你的插件符合规范要求
2. 确保你的插件遵循 [插件规范](#插件规范)
3. 准备好插件的相关信息

### 提交步骤

1. Fork 本仓库
2. 在 `plugins.json` 文件中添加你的插件信息
3. 提交 Pull Request
4. 等待自动化检查和审核

### 插件信息格式

每个插件需要提供以下信息：

#### 必填字段

| 字段名      | 类型   | 描述                           | 示例                    |
| ----------- | ------ | ------------------------------ | ----------------------- |
| name        | string | 插件包名                       | "karin-plugin-basic"    |
| type        | string | 插件类型                       | "npm" \| "git" \| "app" |
| description | string | 插件描述（限制50字符）         | "karin plugin basic"    |
| time        | string | 发布时间 (YYYY-MM-DD HH:mm:ss) | "2025-01-19 10:00:00"   |
| license     | object | 开源协议信息                   | 见下方示例              |

#### 许可证信息 (license)

| 字段名 | 类型   | 描述       | 示例                                                              |
| ------ | ------ | ---------- | ----------------------------------------------------------------- |
| name   | string | 许可证名称 | "MIT"                                                             |
| url    | string | 许可证地址 | "https://github.com/karinjs/karin-plugin-basic/blob/main/LICENSE" |

#### 作者信息 (author)

作者信息是一个数组，支持多个作者：

| 字段名 | 类型   | 描述     | 示例                       |
| ------ | ------ | -------- | -------------------------- |
| name   | string | 作者名称 | "shijin"                   |
| home   | string | 作者主页 | "https://github.com/sj817" |

#### 仓库信息 (repo)

仓库信息是一个数组，支持多个仓库：

| 字段名 | 类型   | 描述                                                             | 示例                                            |
| ------ | ------ | ---------------------------------------------------------------- | ----------------------------------------------- |
| type   | string | 仓库类型 ("github" \| "gitee" \| "gitcode" \| "gitlab" \| "npm") | "github"                                        |
| url    | string | 仓库地址                                                         | "https://github.com/karinjs/karin-plugin-basic" |

### 示例

在 `plugins.json` 文件中的 `plugins` 数组中添加你的插件信息。以下是不同类型插件的示例：

```json
{
  "plugins": [
    {
      "name": "karin-plugin-basic",
      "type": "npm",
      "description": "karin plugin basic",
      "license": {
        "name": "MIT",
        "url": "https://github.com/karinjs/karin-plugin-basic/blob/main/LICENSE"
      },
      "time": "2025-01-19 10:00:00",
      "author": [
        {
          "name": "shijin",
          "home": "https://github.com/sj817"
        }
      ],
      "repo": [
        {
          "type": "github",
          "url": "https://github.com/karinjs/karin-plugin-basic"
        }
      ]
    },
    {
      "name": "karin-plugin-git-example",
      "type": "git",
      "description": "这是一个 Git 插件示例",
      "license": {
        "name": "MIT",
        "url": "https://github.com/username/karin-plugin-git-example/blob/main/LICENSE"
      },
      "time": "2024-03-19 10:00:00",
      "author": [
        {
          "name": "作者名字",
          "home": "https://github.com/username"
        }
      ],
      "repo": [
        {
          "type": "github",
          "url": "https://github.com/username/karin-plugin-git-example"
        },
        {
          "type": "gitee",
          "url": "https://gitee.com/username/karin-plugin-git-example"
        }
      ]
    },
    {
      "name": "karin-plugin-app-example",
      "type": "app",
      "description": "这是一个 App 插件示例",
      "license": {
        "name": "GPL-3.0",
        "url": "https://github.com/username/karin-plugin-app-example/blob/main/LICENSE"
      },
      "time": "2024-03-19 10:00:00",
      "author": [
        {
          "name": "作者名字",
          "home": "https://github.com/username"
        }
      ],
      "repo": [
        {
          "type": "github",
          "url": "https://github.com/username/karin-plugin-app-example"
        }
      ],
      "files": [
        "https://example.com/download/plugin-v1.0.0.js",
        "https://mirror.example.com/download/plugin-v1.0.0.js"
      ]
    }
  ]
}
```

### 插件类型说明

1. **NPM 插件** (`type: "npm"`)
   - 通过 npm 包方式发布的插件

2. **Git 插件** (`type: "git"`)
   - 通过 git 仓库方式发布的插件

3. **App 插件** (`type: "app"`)
   - 单应用插件，需要提供文件直链地址
   - 需要在配置中添加 `files` 字段，包含应用文件的直链地址

## 注意事项

- 请确保将新插件添加到 `plugins` 数组中
- name 必须是唯一的
- description 长度限制为 50 字符
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
