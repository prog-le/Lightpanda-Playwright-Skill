'use strict'

/**
 * 页面测试模板 - Lightpanda + Playwright
 * 用途：断言页面元素、验证功能是否正常
 */

import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts       = { host: '127.0.0.1', port: 9222 };
const playwrightopts = { endpointURL: `ws://${lpdopts.host}:${lpdopts.port}` };

// ===== 测试配置 =====
const TARGET = 'TARGET_URL';
// ====================

// 简易断言工具
let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

function assertContains(text, keyword, msg) {
  assert(text?.includes(keyword), msg || `页面包含 "${keyword}"`);
}

(async () => {
  const proc = await lightpanda.serve(lpdopts);
  console.log('🐼 Lightpanda 启动, PID:', proc.pid);

  const browser = await chromium.connectOverCDP(playwrightopts);
  const context = await browser.newContext({});
  const page    = await context.newPage();

  console.log(`\n🧪 开始测试: ${TARGET}\n`);

  try {
    // ===== 测试用例 =====

    // 测试 1：页面可以正常加载
    const res = await page.goto(TARGET);
    assert(res?.status() < 400, `页面加载成功 (status: ${res?.status()})`);

    // 测试 2：页面有标题
    const title = await page.title();
    assert(title?.length > 0, `页面有标题: "${title}"`);

    // 测试 3：页面有 h1 标签
    const h1Count = await page.locator('h1').count();
    assert(h1Count > 0, `页面包含 h1 标签 (共 ${h1Count} 个)`);

    // 测试 4：页面有链接
    const linkCount = await page.locator('a[href]').count();
    assert(linkCount > 0, `页面包含链接 (共 ${linkCount} 个)`);

    // 测试 5：页面没有 JS 错误（通过监听 console）
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForTimeout(500);
    assert(errors.length === 0, `页面无 JS 错误${errors.length > 0 ? ': ' + errors[0] : ''}`);

    // ===== 在此添加更多测试 =====
    // const text = await page.locator('.main-content').textContent();
    // assertContains(text, 'Expected Text', '主内容包含期望文本');

  } catch (err) {
    console.error('❌ 测试异常:', err.message);
    failed++;
  } finally {
    await page.close();
    await context.close();
    await browser.close();
    proc.stdout.destroy();
    proc.stderr.destroy();
    proc.kill();
  }

  // 输出报告
  console.log(`\n${'━'.repeat(40)}`);
  console.log(`测试报告: ${passed + failed} 个测试`);
  console.log(`  ✅ 通过: ${passed}`);
  console.log(`  ❌ 失败: ${failed}`);
  console.log('━'.repeat(40));

  if (failed > 0) process.exit(1);
})();
