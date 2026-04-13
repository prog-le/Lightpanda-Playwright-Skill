---
name: lightpanda-playwright
description: >
  使用 Lightpanda 超高性能无头浏览器驱动 Playwright 进行网页自动化、数据抓取、网页测试。
  触发词：lightpanda、轻熊猫浏览器、playwright lightpanda、无头浏览器抓取、高性能爬虫、
  CDP浏览器、lightpanda playwright、playwright cdp、网页自动化、页面截图抓取、
  用lightpanda、lightpanda跑playwright、playwright连接lightpanda
version: "1.0.0"
author: auto-generated from https://lightpanda.io/docs/
read_when:
  - 用户需要用 Playwright 做网页自动化或数据抓取
  - 用户提到 lightpanda、无头浏览器
  - 用户需要高性能、低内存占用的浏览器方案
---

# Lightpanda + Playwright Skill

Lightpanda 是专为机器设计的 AI 原生无头浏览器，比 Chrome 快 **9倍**，内存占用少 **16倍**。通过 CDP 协议与 Playwright 无缝集成。

## 核心优势

- **极速**：比 Headless Chrome 快 9 倍
- **低内存**：内存占用仅 Chrome 的 1/16
- **即时启动**：无需等待浏览器冷启动
- **完全兼容**：支持 Playwright 和 Puppeteer 的全部 API
- **JS 执行**：完整支持 JavaScript 和 Web APIs

## 工作原理

```
Lightpanda 启动 CDP 服务器 (ws://127.0.0.1:9222)
         ↓
Playwright chromium.connectOverCDP() 连接
         ↓
使用标准 Playwright API 操作页面
```

---

## 快速开始工作流

### Step 1：初始化项目

```bash
# 创建项目目录
mkdir my-project && cd my-project

# 初始化 npm（必须设置 type: module）
npm init -y
# 修改 package.json 添加 "type": "module"

# 安装依赖
npm install --save @lightpanda/browser playwright-core
```

> ⚠️ **重要**：`package.json` 中必须设置 `"type": "module"`，否则 ESM import 会报错。
> ⚠️ 使用 `playwright-core` 而非 `playwright`，避免下载 Chromium（我们用 Lightpanda 替代）。

### Step 2：创建脚本

最小可运行模板：

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

### Step 3：运行

```bash
node index.js
```

---

## 常用场景模板

使用 `generate.js` 快速生成对应场景的脚本：

```bash
# 生成数据抓取脚本
node scripts/generate.js --template scraper --url https://news.ycombinator.com --output scraper.js

# 生成截图脚本
node scripts/generate.js --template screenshot --url https://example.com --output screenshot.js

# 生成表单自动化脚本
node scripts/generate.js --template form --output form.js

# 生成页面测试脚本
node scripts/generate.js --template test --url https://example.com --output test.js
```

可用模板：
| 模板名 | 用途 |
|--------|------|
| `basic` | 基础模板，快速起步 |
| `scraper` | 数据抓取，提取页面元素 |
| `screenshot` | 多页面截图 |
| `form` | 表单填写、点击交互、结果提取 |
| `test` | 页面测试 + 断言报告 |

---

## 常用 Playwright API 速查

```javascript
// 导航
await page.goto('https://example.com');
await page.waitForLoadState('domcontentloaded'); // 等待 DOM 加载完成
await page.waitForLoadState('networkidle');       // 等待网络空闲

// 元素定位
const el = page.locator('h1');                        // CSS 选择器
const el = page.locator('text=Submit');               // 文本匹配
const el = page.locator('[data-testid="btn"]');        // 属性选择器

// 操作元素
await page.locator('input[name="q"]').fill('keyword'); // 填写输入框
await page.locator('button[type="submit"]').click();   // 点击按钮
await page.keyboard.press('Enter');                    // 键盘事件

// 等待
await page.waitForSelector('.result-item', { timeout: 5000 });
await page.waitForFunction(() => document.querySelector('.loaded') != null);

// 提取数据
const text = await page.locator('h1').textContent();
const links = await page.locator('a').evaluateAll(els => els.map(e => e.href));
const data  = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('.title').textContent,
    href:  el.querySelector('a').href,
  }));
});

// 截图
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

---

## 配置选项

### Lightpanda serve 选项

```javascript
const lpdopts = {
  host: '127.0.0.1',      // 绑定地址
  port: 9222,              // 端口（默认 9222）
};
```

### 命令行方式启动（不用 Node.js 包）

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

---

## 参考资料

- [官方文档](https://lightpanda.io/docs/)
- [安装与设置](https://lightpanda.io/docs/quickstart/installation-and-setup)
- [第一个测试](https://lightpanda.io/docs/quickstart/your-first-test)
- [数据抓取示例](https://lightpanda.io/docs/quickstart/build-your-first-extraction-script)
- [CDP 使用说明](https://lightpanda.io/docs/open-source/usage)
- [完整 API 参考](references/api.md)
- [HN 抓取示例](references/example-hn-scraper.js)
