# Karin 插件市场 - Web 应用部署指南

本文档详细说明如何部署和配置 Karin 插件市场 Web 应用。

## 目录

- [架构概述](#架构概述)
- [GitHub OAuth 配置](#github-oauth-配置)
- [部署到 GitHub Pages](#部署到-github-pages)
- [本地开发](#本地开发)
- [测试方法](#测试方法)
- [常见问题](#常见问题)

## 架构概述

这个 Web 应用是一个基于 React 的静态单页应用（SPA），用于简化插件提交流程。主要功能包括：

1. **GitHub OAuth 登录** - 让用户通过 GitHub 账号登录
2. **仓库选择** - 自动获取并展示用户的 GitHub 仓库
3. **智能检测** - 自动勾选已提交的插件（基于 package.json 的 name 字段）
4. **npm 验证** - 对于 npm 类型插件，验证包是否存在于 npm registry
5. **类型支持** - 支持 npm 包和单 JS 文件（app 类型）

## GitHub OAuth 配置

### 步骤 1: 创建 GitHub OAuth App

1. 访问 GitHub Settings → Developer settings → OAuth Apps
2. 点击 "New OAuth App"
3. 填写以下信息：
   - **Application name**: Karin Plugin Marketplace
   - **Homepage URL**: `https://karinjs.github.io/plugins-list/`
   - **Authorization callback URL**: `https://karinjs.github.io/plugins-list/`
4. 点击 "Register application"
5. 记录下 **Client ID**

### 步骤 2: 配置环境变量

由于这是纯前端应用，Client ID 可以公开（但 Client Secret 必须保密）。

对于 GitHub Actions 自动部署，需要在仓库 Settings 中配置：

1. 进入仓库的 Settings → Secrets and variables → Actions
2. 添加 Repository secret:
   - Name: `VITE_GITHUB_CLIENT_ID`
   - Value: 你的 GitHub OAuth App Client ID

### 步骤 3: OAuth 回调处理

**重要**: GitHub OAuth 需要后端服务来安全地交换 authorization code 为 access token，因为这个过程需要 Client Secret，不能暴露在前端。

有两种解决方案：

#### 方案 A: 使用无服务器函数（推荐）

使用 Cloudflare Workers、Vercel Functions 或 GitHub Actions 来处理 OAuth 回调：

```javascript
// 示例 Cloudflare Worker
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response('Missing code', { status: 400 });
    }
    
    // 使用 code 和 client_secret 交换 token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    // 返回 token 或重定向回应用
    return Response.redirect(`https://karinjs.github.io/plugins-list/?token=${tokenData.access_token}`);
  }
}
```

#### 方案 B: 使用 Personal Access Token（开发/测试）

对于开发和测试，可以使用 Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 生成新的 token（classic）
3. 选择 `repo` 和 `read:user` 权限
4. 使用 `web/token-setup.html` 页面设置 token

## 部署到 GitHub Pages

### 自动部署（推荐）

仓库已配置 GitHub Actions 自动部署：

1. 提交代码到 `main` 分支或 `copilot/implement-github-login-feature` 分支
2. GitHub Actions 会自动构建并部署到 GitHub Pages
3. 访问 `https://karinjs.github.io/plugins-list/`

### 手动部署

```bash
cd web
npm install
npm run build

# 部署 dist 目录到 gh-pages 分支
# 或使用 gh-pages 包
npm install -g gh-pages
gh-pages -d dist
```

### 配置 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `(root)`
4. 点击 Save

## 本地开发

### 安装依赖

```bash
cd web
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入 GitHub OAuth Client ID
```

### 启动开发服务器

```bash
npm run dev
```

应用会在 `http://localhost:5173/plugins-list/` 上运行。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 测试方法

### 方法 1: 使用 Token Setup 页面

1. 访问 `http://localhost:5173/plugins-list/token-setup.html`
2. 按照页面指引获取 Personal Access Token
3. 输入 token 并保存
4. 自动跳转到主应用

### 方法 2: 手动设置 Token

1. 获取 Personal Access Token
2. 在浏览器控制台执行：
   ```javascript
   localStorage.setItem('github_token', 'YOUR_TOKEN');
   ```
3. 刷新页面

### 方法 3: 完整 OAuth 流程（需要后端服务）

配置好 OAuth callback 处理后，直接点击登录按钮即可。

## 功能验证清单

- [ ] 登录页面正确显示
- [ ] GitHub OAuth 跳转正常
- [ ] Token 设置后能正常登录
- [ ] 能够获取用户仓库列表
- [ ] 只显示包含 package.json 的仓库
- [ ] 已提交的插件自动勾选
- [ ] 可以选择/取消选择仓库
- [ ] npm 包验证正常工作
- [ ] app 类型插件不验证 npm
- [ ] 提交后显示正确的结果

## 常见问题

### Q: 为什么登录后看不到任何仓库？

A: 可能的原因：
1. Token 权限不足 - 确保 token 有 `repo` 权限
2. 仓库没有 package.json - 应用只显示包含 package.json 的仓库
3. API 请求失败 - 检查浏览器控制台是否有错误

### Q: 如何判断插件类型（npm vs app）？

A: 目前的实现：
- 如果 package.json 中有 `main` 或 `module` 字段，视为 npm 包
- 否则视为 app 类型（单 JS 文件）

您可以根据实际需求调整判断逻辑。

### Q: 如何处理 CORS 错误？

A: 
- GitHub API 和 npm registry 都支持 CORS
- 如果遇到 CORS 问题，可能是：
  1. Token 格式错误
  2. API endpoint 错误
  3. 网络问题

### Q: 部署后 404 错误？

A: 检查：
1. GitHub Pages 是否启用
2. base URL 配置是否正确（`vite.config.js` 中的 `base` 字段）
3. 是否正确部署到 `gh-pages` 分支

### Q: 如何更新已部署的应用？

A: 
1. 提交代码更改
2. GitHub Actions 会自动重新部署
3. 或手动运行 `npm run build` 和 `gh-pages -d dist`

## 安全注意事项

1. **永远不要**在前端代码中暴露 Client Secret
2. **永远不要**将 Personal Access Token 提交到代码仓库
3. 使用环境变量来管理敏感配置
4. 定期轮换 Personal Access Token
5. 限制 Token 的权限范围

## 性能优化

1. 懒加载组件
2. 实现虚拟滚动（如果仓库很多）
3. 缓存 API 响应
4. 压缩构建产物

## 后续改进建议

1. 添加搜索和过滤功能
2. 支持批量操作
3. 添加插件详情预览
4. 实现拖拽排序
5. 添加插件统计信息
6. 支持离线模式
7. 添加单元测试和 E2E 测试
8. 实现国际化（i18n）

## 技术栈

- React 19
- Vite 7
- GitHub API v3
- npm Registry API
- GitHub Pages

## 联系方式

如有问题或建议，请在 GitHub 仓库提交 Issue。
