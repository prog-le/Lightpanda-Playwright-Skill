#!/bin/bash
# Lightpanda + Playwright 项目初始化 Shell 脚本
# 用法：bash scripts/init.sh [project-name]

PROJECT=${1:-lightpanda-project}

echo ""
echo "🐼 初始化 Lightpanda + Playwright 项目: $PROJECT"
echo ""

# 创建目录
mkdir -p "$PROJECT" && cd "$PROJECT"

# 初始化 package.json
if [ ! -f "package.json" ]; then
  npm init -y
fi

# 添加 "type": "module" 到 package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
pkg.type = 'module';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ 已设置 type: module');
"

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm install --save @lightpanda/browser playwright-core

echo ""
echo "✅ 依赖安装完成"
echo ""

# 创建 index.js
cat > index.js << 'EOF'
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
EOF

echo "✅ 已创建 index.js 示例脚本"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 项目初始化完成！"
echo ""
echo "  cd $PROJECT"
echo "  node index.js"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
