
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
2. 在 `list.ts` 文件中添加你的插件信息
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

在`list.ts`中继续添加即可

```typescript
const list: Plugin[] = [
  {
    name: '基础插件',
    package_name: 'karin-plugin-basic',
    type: 'npm',
    description: 'karin plugin basic',
    license: 'MIT',
    time: '2025-01-19 10:00:00',
    author: [
      {
        name: 'shijin',
        email: 'shijin520@gmail.com',
        home: 'https://github.com/sj817',
      },
    ],
    repo: [
      {
        type: 'github',
        url: 'https://github.com/karinjs/karin-plugin-basic',
      },
    ],
  },
  {
    name: '基础插件',
    package_name: 'karin-plugin-basic',
    type: 'npm',
    description: 'karin plugin basic',
    license: 'MIT',
    time: '2025-01-19 10:00:00',
    author: [
      {
        name: 'shijin',
        email: 'shijin520@gmail.com',
        home: 'https://github.com/sj817',
      },
    ],
    repo: [
      {
        type: 'github',
        url: 'https://github.com/karinjs/karin-plugin-basic',
      },
    ],
  }
]
```

## 注意事项

- package_name 必须是唯一的，且在 npm 上可用
- 时间格式必须严格遵循 "YYYY-MM-DD HH:mm:ss" 格式
- 所有 URL 必须是有效的且可访问的
- 建议使用 MIT 或其他开源协议
- 确保你的插件文档完整，包含安装和使用说明

## 许可证

本仓库采用 MIT 许可证
