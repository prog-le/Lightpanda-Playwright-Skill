'use strict'

/**
 * 截图模板 - Lightpanda + Playwright
 * 用途：批量对多个 URL 进行截图
 */

import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts       = { host: '127.0.0.1', port: 9222 };
const playwrightopts = { endpointURL: `ws://${lpdopts.host}:${lpdopts.port}` };

// ===== 配置区 =====
const PAGES = [
  { url: 'TARGET_URL', filename: 'screenshot-1.png' },
  // 可继续添加更多页面
  // { url: 'https://example2.com', filename: 'screenshot-2.png' },
];
const FULL_PAGE = true;   // 是否截取整页
const VIEWPORT  = { width: 1280, height: 720 };
// ==================

(async () => {
  const proc = await lightpanda.serve(lpdopts);
  console.log('🐼 Lightpanda 启动, PID:', proc.pid);

  const browser = await chromium.connectOverCDP(playwrightopts);

  for (const { url, filename } of PAGES) {
    const context = await browser.newContext({ viewport: VIEWPORT });
    const page    = await context.newPage();

    try {
      console.log(`📸 截图: ${url}`);
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      await page.screenshot({
        path: filename,
        fullPage: FULL_PAGE,
      });
      console.log(`  ✅ 已保存: ${filename}`);

    } catch (err) {
      console.error(`  ❌ 失败 ${url}:`, err.message);
    } finally {
      await page.close();
      await context.close();
    }
  }

  await browser.close();
  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
  console.log('\n✅ 所有截图完成！');
})();
