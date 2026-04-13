'use strict'

/**
 * 表单自动化模板 - Lightpanda + Playwright
 * 用途：自动填写表单、点击按钮、提取结果
 * 示例：HackerNews 搜索
 */

import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts       = { host: '127.0.0.1', port: 9222 };
const playwrightopts = { endpointURL: `ws://${lpdopts.host}:${lpdopts.port}` };

// ===== 配置区 =====
const TARGET  = 'TARGET_URL';
const KEYWORD = 'lightpanda';          // 搜索关键词
const SEARCH_INPUT    = 'input[name="q"]';   // 搜索框选择器
const RESULT_SELECTOR = '.Story_container';  // 结果容器选择器
const WAIT_TIMEOUT    = 5000;
// ==================

(async () => {
  const proc = await lightpanda.serve(lpdopts);
  console.log('🐼 Lightpanda 启动, PID:', proc.pid);

  const browser = await chromium.connectOverCDP(playwrightopts);
  const context = await browser.newContext({});
  const page    = await context.newPage();

  try {
    // 1. 打开页面
    console.log(`🌐 打开: ${TARGET}`);
    await page.goto(TARGET);
    await page.waitForLoadState('domcontentloaded');

    // 2. 填写搜索框
    console.log(`⌨️  输入关键词: ${KEYWORD}`);
    await page.locator(SEARCH_INPUT).fill(KEYWORD);

    // 3. 提交表单
    await page.keyboard.press('Enter');
    console.log('⏳ 等待结果...');

    // 4. 等待结果加载
    await page.waitForSelector(RESULT_SELECTOR, { timeout: WAIT_TIMEOUT });

    // 5. 提取结果
    const results = await page.evaluate((sel) => {
      return Array.from(document.querySelectorAll(sel)).map(row => ({
        title: row.querySelector('.Story_title span')?.textContent?.trim(),
        url:   row.querySelector('.Story_title a')?.getAttribute('href'),
        meta:  Array.from(
          row.querySelectorAll('.Story_meta > span:not(.Story_separator, .Story_comment)')
        ).map(s => s.textContent?.trim()),
      }));
    }, RESULT_SELECTOR);

    console.log(`\n✅ 找到 ${results.length} 条结果:`);
    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('❌ 出错:', err.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
    proc.stdout.destroy();
    proc.stderr.destroy();
    proc.kill();
  }
})();
