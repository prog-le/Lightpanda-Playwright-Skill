'use strict'

import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts = { host: '127.0.0.1', port: 9222 };
const playwrightopts = { endpointURL: `ws://${lpdopts.host}:${lpdopts.port}` };

(async () => {
  const proc = await lightpanda.serve(lpdopts);
  console.log('🐼 Lightpanda 已启动, PID:', proc.pid);

  const browser = await chromium.connectOverCDP(playwrightopts);
  const context = await browser.newContext({});
  const page = await context.newPage();

  await page.goto('https://example.com');
  const title = await page.title();
  console.log('✅ 页面标题:', title);

  await page.close();
  await context.close();
  await browser.close();

  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
  console.log('✅ 完成！');
})();
