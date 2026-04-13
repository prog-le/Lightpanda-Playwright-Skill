'use strict'

/**
 * Hacker News 搜索抓取示例
 * 来源：https://lightpanda.io/docs/quickstart/build-your-first-extraction-script
 *
 * 功能：搜索 HackerNews，提取搜索结果的标题、链接和元数据
 *
 * 运行：
 *   node references/example-hn-scraper.js
 */

import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts = {
  host: '127.0.0.1',
  port: 9222,
};

const playwrightopts = {
  endpointURL: `ws://${lpdopts.host}:${lpdopts.port}`,
};

const KEYWORD = 'lightpanda';

(async () => {
  // 启动 Lightpanda
  const proc = await lightpanda.serve(lpdopts);
  console.log('🐼 Lightpanda 启动, PID:', proc.pid);

  // 使用 Playwright 连接
  const browser = await chromium.connectOverCDP(playwrightopts);
  const context = await browser.newContext({});
  const page = await context.newPage();

  try {
    // 访问 HackerNews
    console.log('🌐 打开 HackerNews...');
    await page.goto('https://news.ycombinator.com/');
    await page.waitForLoadState('domcontentloaded');

    // 搜索关键词
    console.log(`🔍 搜索: ${KEYWORD}`);
    await page.locator('input[name="q"]').fill(KEYWORD);
    await page.keyboard.press('Enter');

    // 等待搜索结果
    console.log('⏳ 等待结果...');
    await page.waitForSelector('.Story_container', { timeout: 5000 });

    // 提取数据
    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.Story_container')).map(row => ({
        title: row.querySelector('.Story_title span')?.textContent?.trim(),
        url:   row.querySelector('.Story_title a')?.getAttribute('href'),
        meta:  Array.from(
          row.querySelectorAll('.Story_meta > span:not(.Story_separator, .Story_comment)')
        ).map(s => s.textContent?.trim()),
      }));
    });

    console.log(`\n✅ 找到 ${results.length} 条结果：\n`);
    results.forEach((item, i) => {
      console.log(`[${i + 1}] ${item.title}`);
      console.log(`    ${item.url}`);
      console.log(`    ${item.meta?.join(' | ')}`);
      console.log();
    });

  } catch (err) {
    console.error('❌ 出错:', err.message);
  } finally {
    // 清理
    await page.close();
    await context.close();
    await browser.close();
    proc.stdout.destroy();
    proc.stderr.destroy();
    proc.kill();
    console.log('✅ 完成');
  }
})();
