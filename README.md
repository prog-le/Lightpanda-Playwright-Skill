# lightpanda-playwright

<div align="center">

**AI Skill** - 使用 Lightpanda 超高性能无头浏览器驱动 Playwright 进行网页自动化、数据抓取、网页测试的Skill。

🐼 专为 AI 编程助手准备的 Lightpanda + Playwright 集成技能

</div>

## 🎯 触发条件

当用户提到以下关键词时，触发此 skill：

- `lightpanda` - 轻熊猫浏览器
- `playwright lightpanda` - Lightpanda + Playwright
- `无头浏览器抓取` - 无头浏览器数据抓取
- `高性能爬虫` - 需要高性能爬虫方案
- `CDP浏览器` - Chrome DevTools Protocol 浏览器
- `playwright cdp` - Playwright CDP 连接
- `网页自动化` - 网页自动化任务
- `页面截图抓取` - 页面截图和数据抓取
- `用lightpanda` - 使用 Lightpanda
- `lightpanda跑playwright` - Lightpanda 运行 Playwright
- `playwright连接lightpanda` - Playwright 连接 Lightpanda

**适用场景：**
- ✅ 用户需要用 Playwright 做网页自动化或数据抓取
- ✅ 用户提到 lightpanda 或无头浏览器
- ✅ 用户需要高性能、低内存占用的浏览器方案
- ✅ 需要大规模网页抓取，希望节省服务器资源
- ✅ CI/CD 中的自动化测试需要加速

## 📖 技能概述

Lightpanda 是专为机器设计的 AI 原生无头浏览器，相比传统的 Chrome Headless 具有显著的性能优势：

- ⚡ **快 9 倍**：比 Headless Chrome 加载速度快 9 倍
- 💾 **内存少 16 倍**：内存占用仅为 Chrome 的 1/16
- 🚀 **即时启动**：无需等待浏览器冷启动
- 🔌 **完全兼容**：支持 Playwright 标准 API，无需重写代码
- 🧩 **JS 完整支持**：完整支持 JavaScript 和 Web APIs

本技能提供：
- 📁 完整的项目模板（5 种场景）
- 📚 详细的 API 参考文档
- 🎨 一键生成脚本工具
- 💡 开箱即用的示例代码

## ⚡ 核心优势

| 特性 | Lightpanda | Chrome Headless |
|------|------------|-----------------|
| 启动速度 | ⚡ 极快 | 🐢 慢 |
| 内存占用 | 💾 极低 | 📈 高 |
| CDP 支持 | ✅ 完整 | ✅ 完整 |
| Playwright 兼容 | ✅ 完全兼容 | ✅ 完全兼容 |
| 二进制大小 | 📦 小巧 | 📦 庞大 |

## 🏗️ 工作原理

```
┌─────────────────────────────────────────────┐
│                                             │
│  Lightpanda 启动 CDP 服务器 (ws://localhost:9222)  │
│             ↓                                │
│  Playwright chromium.connectOverCDP() 连接   │
│             ↓                                │
│  使用标准 Playwright API 操作页面            │
│                                             │
└─────────────────────────────────────────────┘
```

Lightpanda 通过 Chrome DevTools Protocol (CDP) 暴露接口，Playwright 通过标准的 `connectOverCDP` 方法连接，从而实现无缝集成。你可以使用熟悉的 Playwright API 编写代码，享受 Lightpanda 带来的性能提升。

## 🚀 快速开始

### 方式一：使用初始化脚本（推荐）

```bash
# 在当前目录初始化项目
./scripts/init.sh
```

或者使用 Node.js 版本：

```bash
node scripts/init.js
```

### 方式二：手动步骤

**Step 1：创建项目并安装依赖**

```bash
mkdir my-project && cd my-project
npm init -y
```

编辑 `package.json`，添加 `"type": "module"`：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {}
}
```

安装依赖：

```bash
npm install --save @lightpanda/browser playwright-core
```

> ⚠️ **重要提示：**
> - 必须设置 `"type": "module"`，否则 ESM import 会报错
> - 使用 `playwright-core` 而非 `playwright`，避免下载 Chromium（我们用 Lightpanda 替代）

**Step 2：创建脚本**

```javascript
'use strict'

import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts = { host: '127.0.0.1', port: 9222 };
const playwrightopts = { endpointURL: `ws://${lpdopts.host}:${lpdopts.port}` };

(async () => {
  const proc = await lightpanda.serve(lpdopts);

  const browser = await chromium.connectOverCDP(playwrightopts);
  const context = await browser.newContext({});
  const page = await context.newPage();

  // ===== 在这里写你的自动化逻辑 =====
  await page.goto('https://example.com');
  const title = await page.title();
  console.log('页面标题:', title);
  // ==================================

  await page.close();
  await context.close();
  await browser.close();

  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
})();
```

**Step 3：运行**

```bash
node index.js
```

## 🎨 模板生成

使用 `generate.js` 快速生成对应场景的脚本：

```bash
# 基础模板
node scripts/generate.js --template basic --output basic.js

# 数据抓取
node scripts/generate.js --template scraper --url https://news.ycombinator.com --output scraper.js

# 页面截图
node scripts/generate.js --template screenshot --url https://example.com --output screenshot.js

# 表单自动化
node scripts/generate.js --template form --output form-automation.js

# 页面测试
node scripts/generate.js --template test --url https://example.com --output test.js
```

**可用模板：**

| 模板名 | 用途 |
|--------|------|
| `basic` | 基础模板，快速起步，验证环境 |
| `scraper` | 数据抓取，提取页面元素数据 |
| `screenshot` | 网页截图，支持整页截取 |
| `form` | 表单填写、点击交互、结果提取 |
| `test` | 页面测试 + 断言报告生成 |

## 📚 API 速查

### 导航与等待

```javascript
await page.goto('https://example.com');
await page.waitForLoadState('domcontentloaded'); // 等待 DOM 加载完成
await page.waitForLoadState('networkidle');       // 等待网络空闲
```

### 元素定位

```javascript
const el = page.locator('h1');                        // CSS 选择器
const el = page.locator('text=Submit');               // 文本匹配
const el = page.locator('[data-testid="btn"]');        // 属性选择器
const el = page.locator('.container').locator('a');    // 链式组合
```

### 元素操作

```javascript
await page.locator('input[name="q"]').fill('keyword'); // 填写输入框
await page.locator('button[type="submit"]').click();   // 点击按钮
await page.keyboard.press('Enter');                    // 键盘事件
await page.locator('select').selectOption('value');    // 下拉框选择
```

### 数据提取

```javascript
// 提取单个文本
const text = await page.locator('h1').textContent();

// 批量提取
const links = await page.locator('a').evaluateAll(els =>
  els.map(el => ({ text: el.textContent, href: el.href }))
);

// 自定义提取
const data = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('h2')?.textContent?.trim(),
    url: el.querySelector('a')?.href,
  }));
});
```

### 截图

```javascript
await page.screenshot({ path: 'screenshot.png', fullPage: true });
await page.locator('.chart').screenshot({ path: 'chart.png' });
```

完整 API 文档请查看：[references/api.md](./references/api.md)

## ⚙️ 配置选项

### Node.js API 配置

```javascript
const lpdopts = {
  host: '127.0.0.1',      // 绑定地址
  port: 9222,              // 端口（默认 9222）
};

const proc = await lightpanda.serve(lpdopts);
```

### 命令行启动

```bash
./lightpanda serve --host 127.0.0.1 --port 9222 --obey-robots
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--host` | 绑定地址 | `127.0.0.1` |
| `--port` | 端口号 | `9222` |
| `--obey-robots` | 遵守 robots.txt | 关闭 |
| `--timeout` | 空闲超时（秒） | `10` |
| `--cdp-max-connections` | 最大并发连接数 | `16` |
| `--http-proxy` | HTTP 代理地址 | 无 |

## 💡 使用场景

### 🕷️ 数据抓取
- 批量抓取网页数据
- 动态内容抓取（需要 JavaScript 渲染）
- 大规模爬虫，节省服务器资源

### 🧪 自动化测试
- E2E 测试加速
- CI/CD 流水线更快完成
- 降低测试资源消耗

### 📸 网页截图
- 生成网页缩略图
- 批量截图
- 报告生成

### 🤖 RPA 流程自动化
- 表单自动填写
- 网页任务自动化
- 监控与巡检

## 📂 项目结构

```
lightpanda-playwright/
├── SKILL.md                 # Skill 元数据定义（供 AI 读取）
├── README.md                # 本文件 - 使用说明
├── package.json             # 项目依赖信息
│
├── references/              # 参考资料
│   ├── api.md              # 完整 API 参考
│   └── example-hn-scraper.js  # Hacker News 抓取示例
│
├── scripts/                # 工具脚本
│   ├── generate.js         # 模板生成工具
│   ├── init.js             # Node.js 初始化脚本
│   └── init.sh             # Shell 初始化脚本
│
└── templates/              # 场景模板
    ├── basic.js            # 基础模板
    ├── scraper.js          # 数据抓取模板
    ├── screenshot.js       # 截图模板
    ├── form-automation.js  # 表单自动化模板
    └── test.js             # 测试模板
```

## 🔍 示例代码

### 完整示例：抓取 Hacker News 搜索结果

完整代码：[references/example-hn-scraper.js](./references/example-hn-scraper.js)

运行示例：

```bash
npm install
node references/example-hn-scraper.js
```

输出：

```
🐼 Lightpanda 启动, PID: 12345
🌐 打开 HackerNews...
🔍 搜索: lightpanda
⏳ 等待结果...

✅ 找到 5 条结果：

[1] lightpanda - The AI-native browser for the web
    https://github.com/lightpanda-io/browser
    1 day ago | 50 points | 12 comments
```

## ❓ 常见问题

**Q: 为什么要用 Lightpanda 而不是 Chrome？**

A: 如果你需要高性能、低内存占用，特别是在大规模抓取或持续自动化任务中，Lightpanda 相比 Chrome 能显著降低资源消耗和提高速度。

**Q: 为什么要用 `playwright-core` 而不是 `playwright`？**

A: `playwright` 包会自动下载 Chromium/Firefox/WebKit，而我们用 Lightpanda 作为浏览器，不需要这些。`playwright-core` 只包含 API，不含浏览器二进制。

**Q: 必须设置 `"type": "module"` 吗？**

A: 是的。`@lightpanda/browser` 是 ES Module，需要在 `package.json` 中设置 `"type": "module"` 才能使用 `import` 语法。

**Q: 支持哪些平台？**

A: macOS (Intel / Apple Silicon)、Linux (x86_64 / arm64)、Windows（通过 WSL2）。

**Q: 兼容性如何？**

A: Lightpanda 支持 CDP 协议，Playwright API 完全兼容。但部分渲染密集型特性（如 WebGL、CSS 动画精确测试）可能与 Chrome 有差异。对于大多数数据抓取和自动化场景，完全够用。

## 🤖 AI 助手使用说明

对于 AI 编程助手：

1. 当用户请求涉及 Lightpanda 或高性能无头浏览器时，加载此 skill
2. 使用 `scripts/generate.js` 根据用户需求生成对应模板
3. 参考 [references/api.md](./references/api.md) 获取完整 API 文档
4. 根据用户具体需求，在模板基础上编写业务逻辑
5. 提醒用户检查 `package.json` 中是否设置了 `"type": "module"`

## 🔗 参考链接

- [Lightpanda 官方网站](https://lightpanda.io/)
- [Lightpanda 官方文档](https://lightpanda.io/docs/)
- [Lightpanda GitHub](https://github.com/lightpanda-io/browser)
- [Playwright 官方文档](https://playwright.dev/docs/intro)
- [完整 API 参考](./references/api.md)

## 📄 许可证

本技能基于 MIT 许可证开源。Lightpanda 本身使用 [AGPL-3.0](https://github.com/lightpanda-io/browser/blob/main/LICENSE) 许可证。

---

<div align="center">
  <p>🤖 这是一个 AI Skill，供 AI 编程助手使用。</p>
</div>
