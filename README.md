# ChatGPT Clone 前端

一个简洁的 React + TypeScript + Vite 聊天界面。

## 介绍
- 轻量，前后端分离。
- 适合接自己的模型服务或代理网关。

## 功能亮点
- 会话管理与消息历史
- 主题切换（浅色 / 深色 / 海洋）
- Markdown 渲染与代码高亮，支持复制代码
- 设置面板：模型、Web Access、Jailbreak

## 环境
- Node.js ≥ 18（建议 18/20 LTS）
- 包管理器：推荐 pnpm（也可用 npm/yarn）

## 安装与启动
1) 获取代码：
```
git clone https://github.com/976282479/Chatgpt-clone.git
cd Chatgpt-clone
```
2) 安装 pnpm（通过 npm）：
```
npm install -g pnpm
```
3) 准备环境变量：
- Windows：
```
copy .env.local.example .env.local
```
- macOS/Linux：
```
cp .env.local.example .env.local
```
按需修改 `.env.local`，常用配置：
```
VITE_API_BASE_URL=http://localhost:3000
VITE_REQUEST_TIMEOUT=30000
```
4) 安装依赖并启动：
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
- 构建产物：`dist/`

## 部署
构建完成后，把 `dist/` 放到静态托管或 Nginx 即可。示例：
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
后端接口由 `VITE_API_BASE_URL` 指向你的服务，需允许 CORS。

## 目录
- `src/components/`：聊天区、侧栏、设置弹窗、输入框、消息气泡
- `src/lib/api.ts`：后端请求封装
- `src/types/chat.ts`：类型定义
- 其他：`index.css`、`App.css`、`main.tsx`、`vite.config.ts`

## 常见问题
- dev 报 HMR `net::ERR_ABORTED`：一般可忽略，保存或重启 dev 即可。
- 主题没生效：检查外部容器样式；本项目已作用到 `html/body`。
- 404 / 跨域：确认 `VITE_API_BASE_URL` 正确，后端放开 CORS。