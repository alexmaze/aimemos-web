# aimemos-web

[aimemos](https://github.com/alexmaze/aimemos) 项目的 Web 前端 - 一个 AI 驱动的个人知识管理系统。

## 功能特性

- **备忘录**：用于快速记录想法和提醒的轻量级笔记
- **知识库**：文档和笔记的有序集合
- **文档管理**：创建、编辑和组织 Markdown 笔记，上传各种文档格式
- **AI 对话**：与基于知识库的 AI 助手进行交互式对话（RAG）
- **简洁 UI**：受 Apple 设计启发，专注于简洁和优雅

## 技术栈

- **React 18** - 现代 UI 库
- **TypeScript** - 类型安全开发
- **Vite** - 快速构建工具和开发服务器
- **React Router** - 客户端路由
- **Zustand** - 轻量级状态管理
- **TailwindCSS** - 实用优先的 CSS 框架
- **Axios** - HTTP 客户端
- **Lucide React** - 精美图标库
- **React Markdown** - Markdown 渲染

## 前置要求

- Node.js 18+ 和 npm
- 运行中的 [aimemos](https://github.com/alexmaze/aimemos) 后端实例

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/alexmaze/aimemos-web.git
cd aimemos-web
```

2. 安装依赖：
```bash
npm install
```

3. 创建环境文件：
```bash
cp .env.example .env
```

4. 在 `.env` 中配置 API 端点：
```
VITE_API_BASE_URL=http://localhost:8000
```

## 开发

启动开发服务器：
```bash
npm run dev
```

应用将在 `http://localhost:5173` 可用

## 构建

生产环境构建：
```bash
npm run build
```

预览生产构建：
```bash
npm run preview
```

## 项目结构

```
src/
├── api/              # API 客户端和服务模块
├── components/       # 可复用 React 组件
├── pages/            # 页面组件
├── stores/           # Zustand 状态存储
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── App.tsx           # 主应用组件与路由
├── main.tsx          # 应用入口点
└── index.css         # 全局样式和 Tailwind 指令
```

## 使用

### 首次设置

1. 启动 aimemos 后端服务器
2. 在浏览器中打开前端应用
3. 注册新账户或登录
4. 创建您的第一个知识库
5. 添加文档和笔记
6. 开始与 AI 助手对话

### 功能指南

#### 备忘录
- 用于日常想法的快速轻量级笔记
- 基于标签的组织
- 全文搜索

#### 知识库
- 按主题或项目组织文档
- 支持文件夹和层级结构
- 上传文档（PDF、Word、Markdown 等）

#### 文档
- 创建和编辑 Markdown 笔记
- 上传外部文档
- 使用文件夹组织
- 跨所有文档搜索

#### AI 对话
- 创建对话会话
- 将会话与知识库关联以获得 RAG 驱动的回复
- 查看对话历史
- 访问知识库上下文

## API 集成

前端连接到 aimemos 后端 API。主要端点：

- `/api/v1/auth/*` - 认证
- `/api/v1/memos/*` - 备忘录管理
- `/api/v1/knowledge-bases/*` - 知识库管理
- `/api/v1/documents/*` - 文档管理
- `/api/v1/chats/*` - 对话会话和消息

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 致谢

- 后端 API：[aimemos](https://github.com/alexmaze/aimemos)
- 设计灵感：Apple 的设计原则
