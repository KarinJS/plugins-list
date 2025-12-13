# Karin 插件市场提交页面

这是一个用于提交插件到 Karin 插件市场的 React 应用。

## 功能

- ✅ GitHub OAuth 登录
- ✅ 自动获取用户的 GitHub 仓库
- ✅ 自动检测并勾选已提交的插件（基于 package.json 的 name 字段）
- ✅ 验证 npm 包是否存在（对于 npm 类型插件）
- ✅ 支持单 JS 文件类型插件（app 类型，无需 npm 验证）

## 开发

### 前置要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 配置 GitHub OAuth

1. 在 GitHub 创建 OAuth App：https://github.com/settings/developers
2. 设置 Authorization callback URL：
   - 开发环境：`http://localhost:5173/plugins-list/`
   - 生产环境：`https://karinjs.github.io/plugins-list/`
3. 复制 `.env.example` 到 `.env`
4. 在 `.env` 中填入你的 Client ID

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 部署

构建后的文件在 `dist` 目录中，可以部署到 GitHub Pages 或任何静态网站托管服务。

#### GitHub Pages 部署

1. 确保仓库有 `gh-pages` 分支
2. 运行构建命令
3. 将 `dist` 目录的内容推送到 `gh-pages` 分支

## 测试说明

由于 GitHub OAuth 需要后端服务来交换 access token（不能在前端暴露 client secret），当前实现包含以下测试方法：

### 方法 1：使用个人访问令牌（Personal Access Token）

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 和 `read:user` 权限
4. 生成令牌并复制
5. 在浏览器控制台运行：
   ```javascript
   localStorage.setItem('github_token', 'YOUR_TOKEN_HERE');
   ```
6. 刷新页面

### 方法 2：完整 OAuth 流程

需要配置后端服务来处理 OAuth 回调并交换 token。可以使用：
- GitHub Actions
- Cloudflare Workers
- Vercel Serverless Functions
- 或任何其他后端服务

## 使用说明

1. 点击"使用 GitHub 登录"按钮
2. 授权应用访问您的 GitHub 仓库
3. 查看包含 `package.json` 的仓库列表
4. 已提交的插件会自动勾选并显示"已提交"标签
5. 选择要提交的仓库
6. 点击"提交"按钮进行验证
7. 验证成功后，会显示可提交的仓库列表

## 注意事项

- 只有包含 `package.json` 的仓库才会显示
- npm 类型插件会验证包是否在 npm 上存在
- app 类型插件（单 JS 文件）不需要 npm 验证
- 插件名称基于 `package.json` 中的 `name` 字段
