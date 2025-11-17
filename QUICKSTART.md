# 快速开始指南

## 前置要求

1. **后端服务器**：您需要运行 [aimemos](https://github.com/alexmaze/aimemos) 后端
   ```bash
   # 在 aimemos 仓库中
   uv run aimemos
   # 服务器将在 http://localhost:8000 启动
   ```

2. **Node.js**：版本 18 或更高

## 安装

1. 克隆并安装：
   ```bash
   git clone https://github.com/alexmaze/aimemos-web.git
   cd aimemos-web
   npm install
   ```

2. 配置环境：
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 并设置：
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```
   
   在浏览器中打开 http://localhost:5173

## 首次使用

1. **注册账户**：在登录页面点击"注册"
2. **创建知识库**：导航到知识库 → 新建知识库
3. **添加文档**： 
   - 点击知识库查看文档
   - 使用"新建笔记"创建笔记
   - 使用"上传"上传文件
   - 使用"新建文件夹"组织
4. **使用备忘录**：在备忘录页面记录日常想法的快速笔记
5. **与 AI 对话**： 
   - 转到对话页面
   - 创建新会话
   - 选择知识库以获得 RAG 驱动的回复
   - 开始对话！

## 常见任务

### 创建备忘录
1. 转到备忘录页面
2. 点击"新建备忘录"
3. 输入标题、内容和可选标签
4. 点击"创建"

### 创建笔记
1. 导航到知识库
2. 点击知识库
3. 点击"新建笔记"
4. 使用 Markdown 格式书写
5. 使用"预览"查看渲染内容
6. 点击"保存"

### 上传文档
1. 导航到知识库
2. 点击"上传"
3. 选择文件（PDF、Word、Markdown 等）
4. 添加可选摘要
5. 点击"上传"

### 与知识库对话
1. 转到对话页面
2. 点击"新建对话"
3. 输入标题
4. 选择知识库（启用 RAG）
5. 输入您的问题并发送

## 生产构建

```bash
npm run build
npm run preview  # 预览生产构建
```

对于部署，使用任何静态文件服务器提供 `dist` 目录。

## 故障排除

**无法连接到 API**
- 确保 aimemos 后端在 8000 端口运行
- 检查 .env 文件中的 VITE_API_BASE_URL
- 检查浏览器控制台的 CORS 错误

**构建错误**
- 删除 node_modules 和 package-lock.json
- 再次运行 `npm install`
- 确保 Node.js 版本为 18+

**登录不工作**
- 检查后端的 ENABLE_REGISTRATION=true
- 验证后端设置了 SECRET_KEY
- 清除浏览器 localStorage 并重试

## 开发

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
npm run lint     # 运行 ESLint
```

## 架构

- **状态管理**：Zustand 用于认证状态
- **路由**：React Router v6 带保护路由
- **API 客户端**：Axios 带认证拦截器
- **样式**：TailwindCSS 带自定义工具类
- **类型安全**：完整的 TypeScript 覆盖
