'use strict'

/**
 * 基础模板 - Lightpanda + Playwright
 * 用途：快速起步，验证环境是否正常
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

(async () => {
  // 1. 启动 Lightpanda CDP 服务器
  const proc = await lightpanda.serve(lpdopts);
  console.log('🐼 Lightpanda 已启动, PID:', proc.pid);

  // 2. 通过 CDP 连接 Playwright
  const browser = await chromium.connectOverCDP(playwrightopts);

  // 3. 创建上下文和页面
  const context = await browser.newContext({});
  const page = await context.newPage();

  // 4. 导航到目标页面
  await page.goto('TARGET_URL');
  await page.waitForLoadState('domcontentloaded');

  // 5. 获取页面基本信息
  const title = await page.title();
  const url   = page.url();
  console.log('✅ 标题:', title);
  console.log('✅ URL:', url);

  // 6. 清理资源
  await page.close();
  await context.close();
  await browser.close();

  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
  console.log('✅ 完成！');
})();
