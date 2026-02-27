# Sticky Note

一个现代化的便签应用，支持无限画板、缩放和拖拽功能。可以用来做笔记、整理思路、规划项目等。

![React](https://img.shields.io/badge/React-19.2.3-%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-%233178C6)
![Vite](https://img.shields.io/badge/Vite-7.3.0-%23646CFF)

## 功能

- 创建、编辑、删除便签
- 15种便签颜色可选
- 5种墙面背景样式
- 画板缩放（0.25x - 3x）
- 拖拽移动画板
- 鼠标滚轮缩放
- 触屏手势支持（单指拖动、双指缩放）
- PWA 支持（可离线使用）

## 快速开始

需要先安装 Node.js。

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

启动后访问 http://localhost:5173

## 使用

### 创建便签

- 点击底部颜色按钮创建对应颜色的便签
- 点击“新建便签”创建随机颜色的便签
- 新便签会出现在画板中央

### 编辑便签

- 点击便签内容区域开始编辑
- 拖拽便签标题栏移动位置
- 拖拽便签右下角调整大小
- 点击工具栏的删除按钮删除便签

### 画板操作

- 使用右下角的 +/- 按钮缩放
- 点击并拖拽空白区域移动画板
- 使用鼠标滚轮缩放（会跟随鼠标位置）
- 双指捏合缩放（触屏）

### 快捷键

- `Ctrl/Cmd + N` - 新建便签
- `Ctrl/Cmd + +` - 放大
- `Ctrl/Cmd + -` - 缩小
- `Ctrl/Cmd + 0` - 重置视图

### PWA 安装

在支持的浏览器中可以看到安装提示，点击安装后应用就可以离线使用了。

## 项目结构

```
src/
├── components/      # 组件
│   ├── note/       # 便签相关组件
│   ├── pwa/        # PWA 组件
│   ├── Canvas.tsx  # 画板
│   └── ...
├── hooks/          # 自定义 Hooks
├── store/          # Zustand 状态管理
├── utils/          # 工具函数
├── constants/      # 常量
├── types.ts        # 类型定义
├── App.tsx
└── main.tsx
```

## 开发命令

| 命令                | 说明           |
| ------------------- | -------------- |
| `npm run dev`       | 启动开发服务器 |
| `npm run build`     | 构建           |
| `npm run preview`   | 预览构建       |
| `npm run lint`      | 代码检查       |
| `npm run lint:fix`  | 自动修复       |
| `npm run format`    | 格式化代码     |
| `npm run typecheck` | 类型检查       |
| `npm run test`      | 运行测试       |
| `npm run test:ui`   | 测试界面       |

## 技术栈

- React 19
- TypeScript
- Vite
- Framer Motion（动画）
- Zustand（状态管理）
- Vitest（测试）

## 贡献

欢迎提 Issue 和 Pull Request。

提交代码前请运行：

```bash
npm run lint
npm run typecheck
npm run test
```

## License

MIT
