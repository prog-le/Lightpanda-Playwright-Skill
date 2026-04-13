# Lightpanda + Playwright 完整 API 参考

> 来源：https://lightpanda.io/docs/

---

## 1. `@lightpanda/browser` API

### `lightpanda.serve(options)`

启动 Lightpanda CDP 服务器进程。

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `host` | string | `'127.0.0.1'` | 绑定地址 |
| `port` | number | `9222` | 端口号 |

**返回：** `Promise<ChildProcess>` — 子进程对象

**示例：**

```javascript
import { lightpanda } from '@lightpanda/browser';

const proc = await lightpanda.serve({ host: '127.0.0.1', port: 9222 });
console.log('PID:', proc.pid);

// 结束时清理
proc.stdout.destroy();
proc.stderr.destroy();
proc.kill();
```

---

## 2. Playwright CDP 连接

### `chromium.connectOverCDP(options)`

通过 CDP 协议连接到正在运行的浏览器（Lightpanda）。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `endpointURL` | string | WebSocket 地址，如 `ws://127.0.0.1:9222` |

**返回：** `Promise<Browser>`

**示例：**

```javascript
import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP({
  endpointURL: 'ws://127.0.0.1:9222',
});
```

---

## 3. Browser API

### `browser.newContext(options)`

创建新的浏览器上下文（隔离 Cookie、LocalStorage 等）。

```javascript
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },  // 视口大小
  userAgent: 'Mozilla/5.0 ...',            // 自定义 UA
  locale: 'zh-CN',                          // 语言
});
```

### `browser.close()`

关闭浏览器连接。

---

## 4. Context API

### `context.newPage()`

创建新页面。

```javascript
const page = await context.newPage();
```

### `context.close()`

关闭浏览器上下文。

---

## 5. Page API

### 导航

```javascript
// 跳转到 URL
await page.goto('https://example.com');
await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });

// 等待加载状态
await page.waitForLoadState('load');            // 全部资源加载
await page.waitForLoadState('domcontentloaded'); // DOM 就绪
await page.waitForLoadState('networkidle');      // 网络空闲

// 刷新页面
await page.reload();

// 后退/前进
await page.goBack();
await page.goForward();
```

### 页面信息

```javascript
const title = await page.title();       // 页面标题
const url   = page.url();               // 当前 URL
const content = await page.content();   // 完整 HTML
```

### 元素定位 - `page.locator(selector)`

```javascript
// CSS 选择器
const el = page.locator('h1');
const el = page.locator('.class-name');
const el = page.locator('#id');
const el = page.locator('[data-testid="btn"]');

// 文本匹配
const el = page.locator('text=Submit');
const el = page.locator('button:has-text("确定")');

// 链式组合
const el = page.locator('.container').locator('a');
```

### 等待元素

```javascript
// 等待元素出现
await page.waitForSelector('.result', { timeout: 5000 });

// 等待自定义条件
await page.waitForFunction(() => {
  return document.querySelector('.loaded') !== null;
}, { timeout: 5000 });

// 等待固定时间（不推荐，调试用）
await page.waitForTimeout(1000);
```

### 元素交互

```javascript
// 点击
await page.locator('button').click();
await page.locator('a.link').click();

// 填写输入框
await page.locator('input[name="q"]').fill('搜索关键词');
await page.locator('textarea').fill('多行\n文本');

// 键盘事件
await page.keyboard.press('Enter');
await page.keyboard.press('Tab');
await page.keyboard.type('逐字输入');

// 下拉框
await page.locator('select').selectOption('value');
await page.locator('select').selectOption({ label: '显示文本' });

// 勾选框
await page.locator('input[type="checkbox"]').check();
await page.locator('input[type="checkbox"]').uncheck();
```

### 数据提取

```javascript
// 提取单个元素文本
const text = await page.locator('h1').textContent();
const innerText = await page.locator('p').innerText();
const html = await page.locator('.content').innerHTML();

// 提取属性
const href = await page.locator('a').getAttribute('href');
const src  = await page.locator('img').getAttribute('src');

// 批量提取（evaluateAll）
const links = await page.locator('a').evaluateAll(els =>
  els.map(el => ({ text: el.textContent, href: el.href }))
);

// 在浏览器上下文中执行 JS
const result = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('.title')?.textContent?.trim(),
    price: el.querySelector('.price')?.textContent?.trim(),
  }));
});

// 传参给 evaluate
const selector = '.item';
const data = await page.evaluate((sel) => {
  return document.querySelector(sel)?.textContent;
}, selector);
```

### 截图

```javascript
// 整页截图
await page.screenshot({ path: 'full.png', fullPage: true });

// 视口截图
await page.screenshot({ path: 'viewport.png' });

// 指定元素截图
await page.locator('.chart').screenshot({ path: 'chart.png' });
```

### 关闭

```javascript
await page.close();
```

---

## 6. Lightpanda 服务器配置（命令行）

```bash
./lightpanda serve \
  --host 127.0.0.1 \
  --port 9222 \
  --obey-robots \
  --timeout 10 \
  --cdp-max-connections 16
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--host` | 绑定地址 | `127.0.0.1` |
| `--port` | 端口号 | `9222` |
| `--advertise-host` | 对外广播地址 | 同 `--host` |
| `--obey-robots` | 遵守 robots.txt | 关闭 |
| `--timeout` | 空闲超时（秒） | `10` |
| `--cdp-max-connections` | 最大并发连接数 | `16` |
| `--http-proxy` | HTTP 代理地址 | 无 |

---

## 7. 完整生命周期示例

```javascript
import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts       = { host: '127.0.0.1', port: 9222 };
const playwrightopts = { endpointURL: `ws://${lpdopts.host}:${lpdopts.port}` };

(async () => {
  // ① 启动 Lightpanda
  const proc = await lightpanda.serve(lpdopts);

  // ② 连接 Playwright
  const browser = await chromium.connectOverCDP(playwrightopts);

  // ③ 创建上下文（支持多个，相互隔离）
  const context = await browser.newContext({});

  // ④ 创建页面
  const page = await context.newPage();

  // ⑤ 执行操作
  await page.goto('https://example.com');
  // ... 你的业务逻辑 ...

  // ⑥ 清理（顺序很重要）
  await page.close();
  await context.close();
  await browser.close();

  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
})();
```

---

## 8. 常见问题

### Q: 为什么要用 `playwright-core` 而不是 `playwright`？
`playwright` 包会自动下载 Chromium/Firefox/WebKit，而我们用 Lightpanda 作为浏览器，不需要这些。`playwright-core` 只包含 API，不含浏览器二进制。

### Q: 必须设置 `"type": "module"` 吗？
是的。`@lightpanda/browser` 是 ES Module，需要在 `package.json` 中设置 `"type": "module"` 才能使用 `import` 语法。

### Q: 支持哪些平台？
- macOS (Intel / Apple Silicon)
- Linux (x86_64 / arm64)
- Windows（通过 WSL2）

### Q: 与 Chrome Headless 的兼容性？
Lightpanda 支持 CDP 协议，Playwright API 完全兼容。但部分渲染密集型特性（如 WebGL、CSS 动画精确测试）可能有差异。
