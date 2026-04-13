#!/usr/bin/env node
/**
 * Lightpanda + Playwright 项目初始化脚本
 * 用法：bash scripts/init.sh [project-name]
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const projectName = process.argv[2] || 'lightpanda-project';

console.log(`\n🐼 初始化 Lightpanda + Playwright 项目: ${projectName}\n`);

// 1. 创建目录
if (!existsSync(projectName)) {
  execSync(`mkdir -p ${projectName}`);
}
process.chdir(projectName);

// 2. 初始化 package.json
if (!existsSync('package.json')) {
  execSync('npm init -y', { stdio: 'inherit' });
}

// 3. 设置 type: module
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
pkg.type = 'module';
writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ 已设置 package.json type: module');

// 4. 安装依赖
console.log('\n📦 安装依赖...');
execSync('npm install --save @lightpanda/browser playwright-core', { stdio: 'inherit' });
console.log('✅ 依赖安装完成');

// 5. 创建示例脚本
const exampleCode = `'use strict'

import { lightpanda } from '@lightpanda/browser';
import { chromium } from 'playwright-core';

const lpdopts = { host: '127.0.0.1', port: 9222 };
const playwrightopts = { endpointURL: \`ws://\${lpdopts.host}:\${lpdopts.port}\` };

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
`;

writeFileSync('index.js', exampleCode);
console.log('✅ 已创建 index.js 示例脚本');

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 项目初始化完成！

  cd ${projectName}
  node index.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
