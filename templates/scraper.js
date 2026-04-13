'use strict'

/**
 * 数据抓取模板 - Lightpanda + Playwright
 * 用途：从网页中批量提取结构化数据
 */

import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts      = { host: '127.0.0.1', port: 9222 };
const playwrightopts = { endpointURL: `ws://${lpdopts.host}:${lpdopts.port}` };

// ===== 配置区 =====
const TARGET   = 'TARGET_URL';
const SELECTOR = 'TARGET_SELECTOR';  // 要抓取元素的 CSS 选择器
// ==================

(async () => {
  const proc = await lightpanda.serve(lpdopts);
  console.log('🐼 Lightpanda 启动, PID:', proc.pid);

  const browser = await chromium.connectOverCDP(playwrightopts);
  const context = await browser.newContext({});
  const page    = await context.newPage();

  try {
    console.log(`🔍 正在抓取: ${TARGET}`);
    await page.goto(TARGET);
    await page.waitForLoadState('domcontentloaded');

    // 等待目标元素出现
    await page.waitForSelector(SELECTOR, { timeout: 10000 });

    // 提取数据
    const results = await page.locator(SELECTOR).evaluateAll(elements =>
      elements.map(el => ({
        text: el.textContent?.trim(),
        href: el.getAttribute('href'),
        // 根据需要添加更多字段
      }))
    );

    console.log(`✅ 共抓取 ${results.length} 条数据:`);
    console.log(JSON.stringify(results, null, 2));

    // 可选：保存到文件
    // import { writeFileSync } from 'fs';
    // writeFileSync('results.json', JSON.stringify(results, null, 2));
    // console.log('💾 已保存到 results.json');

  } catch (err) {
    console.error('❌ 抓取失败:', err.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
    proc.stdout.destroy();
    proc.stderr.destroy();
    proc.kill();
  }
})();
