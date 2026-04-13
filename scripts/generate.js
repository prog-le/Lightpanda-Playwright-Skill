#!/usr/bin/env node
/**
 * 模板代码生成器
 * 用法：node scripts/generate.js --template <name> [--url <url>] [--selector <selector>] [--output <file>]
 *
 * 可用模板：basic | scraper | screenshot | form | test
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

// 解析命令行参数
const args = process.argv.slice(2);
const opts = {};
for (let i = 0; i < args.length; i += 2) {
  opts[args[i].replace('--', '')] = args[i + 1];
}

const template = opts.template || 'basic';
const url      = opts.url      || 'https://example.com';
const selector = opts.selector || 'a';
const output   = opts.output   || `${template}-script.js`;

const templateFile = join(__dir, '../templates', `${template}.js`);

if (!existsSync(templateFile)) {
  console.error(`❌ 模板不存在: ${template}`);
  console.error('可用模板: basic | scraper | screenshot | form | test');
  process.exit(1);
}

let code = readFileSync(templateFile, 'utf-8');

// 替换占位符
code = code
  .replace(/TARGET_URL/g, url)
  .replace(/TARGET_SELECTOR/g, selector);

writeFileSync(output, code);
console.log(`✅ 已生成: ${output}`);
console.log(`   模板: ${template}`);
console.log(`   目标: ${url}`);
console.log(`\n运行方式：node ${output}`);
