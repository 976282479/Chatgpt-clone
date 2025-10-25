# ChatGPT Clone 前端

一个使用 React + TypeScript + Vite 的聊天前端。具备会话管理、主题切换、Markdown 渲染与代码高亮，配置后端地址即可对话。

## 介绍
- 目标：提供一个轻量、可拓展的聊天 UI，前后端分离。
- 使用场景：接入你自己的后端模型服务，或网关代理。

## 功能
- 会话与消息：创建/切换会话，记录对话历史。
- 设置与开关：模型选择、系统提示词，Web Access/Jailbreak 可配置。
- 样式与主题：浅色/深色主题，全屏覆盖（侧栏、底部工具条）。
- Markdown：`react-markdown` + `remark-gfm` + `rehype-highlight`。

## 环境要求
- Node.js ≥ 18（建议 18/20 LTS）
- 推荐包管理器：pnpm（也可用 npm/yarn）

## 安装与启动
1) 安装 pnpm（通过 npm）：
```
npm install -g pnpm
```
2) 在项目根创建 `.env.local`：
```
VITE_API_BASE_URL=http://localhost:3000
VITE_REQUEST_TIMEOUT=30000
```
3) 安装依赖并启动：
```
pnpm install
pnpm dev
```
访问 `http://localhost:5173/`。

## 构建与预览（生产）
```
pnpm build
pnpm preview
```
- 预览地址：`http://localhost:4173/`
- 产物目录：`dist/`

## 部署
将 `dist/` 部署到静态托管或 Nginx：
```
server {
    listen 80;
    server_name your.domain;
    root   /var/www/chatgpt-clone/dist;
    index  index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
后端接口由 `VITE_API_BASE_URL` 指向你的服务，需开启 CORS。

## 目录结构
- `src/components/`：聊天区、侧栏、设置弹窗、消息气泡、输入框
- `src/lib/api.ts`：与后端交互方法
- `src/types/chat.ts`：类型定义
- 其他：`index.css`、`App.css`、`main.tsx`、`vite.config.ts`

## 常见问题
- HMR 报 `net::ERR_ABORTED`：一般可忽略，保存或重启 dev。
- 主题未覆盖：检查外部容器限制；样式已覆盖 `html/body`、侧栏与底部。
- 404/跨域：确认 `VITE_API_BASE_URL` 正确，后端放开 CORS。