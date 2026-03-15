import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';
import { cpSync, readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';

// 构建后将 audio/ 目录复制到 dist/audio/（避免依赖 symlink）
function copyAudioPlugin() {
  return {
    name: 'copy-audio',
    closeBundle() {
      const src = resolve(__dirname, 'audio');
      const dest = resolve(__dirname, 'dist/audio');
      cpSync(src, dest, { recursive: true, force: true });
      console.log('✅ audio/ 已复制到 dist/audio/');
    }
  };
}

// 构建时将多个 <script defer> 合并为单个 bundle 文件
function bundleScriptsPlugin() {
  // 定义每个页面的 bundle 配置
  // key = HTML 文件路径中的标识, value = { bundleName, scripts[] }
  const bundleConfigs = {
    'pages/test1.html': {
      bundleName: 'test1-bundle.js',
      scripts: [
        'js/enhanced-audio-player.js',
        'js/enhanced-answer-sheet.js',
        'js/enhanced-keyboard-navigation.js',
        'js/test-data.js',
        'js/test-answers.js',
        'js/universal-test-generator.js',
        'js/test1-init.js',
        'js/score-engine.js',
        'js/test-page-events.js'
      ]
    },
    'pages/enhanced-test1.html': {
      bundleName: 'enhanced-test1-bundle.js',
      scripts: [
        'js/test-data.js',
        'js/test-answers.js',
        'js/test-renderer.js',
        'js/test-init.js',
        'js/enhanced-answer-sheet.js',
        'js/enhanced-keyboard-navigation.js',
        'js/enhanced-test1-init.js',
        'js/score-engine.js',
        'js/test-page-events.js'
      ]
    },
    'pages/test.html': {
      bundleName: 'test-legacy-bundle.js',
      scripts: [
        'js/universal-audio-player.js',
        'js/test-data.js',
        'js/test-renderer.js',
        'js/test-init.js'
      ]
    },
    // test2-7: bundle shared scripts, keep test-data-N separate
    'pages/test2.html': {
      bundleName: 'test-core-bundle.js',
      scripts: [
        'js/test-renderer.js',
        'js/test-init.js'
      ]
    },
    'pages/test3.html': {
      bundleName: 'test-core-bundle.js',
      scripts: [
        'js/test-renderer.js',
        'js/test-init.js'
      ]
    },
    'pages/test4.html': {
      bundleName: 'test-core-bundle.js',
      scripts: [
        'js/test-renderer.js',
        'js/test-init.js'
      ]
    },
    'pages/test5.html': {
      bundleName: 'test-core-bundle.js',
      scripts: [
        'js/test-renderer.js',
        'js/test-init.js'
      ]
    },
    'pages/test6.html': {
      bundleName: 'test-core-bundle.js',
      scripts: [
        'js/test-renderer.js',
        'js/test-init.js'
      ]
    },
    'pages/test7.html': {
      bundleName: 'test-core-bundle.js',
      scripts: [
        'js/test-renderer.js',
        'js/test-init.js'
      ]
    }
  };

  // 动态添加 test8-test75 到 bundle 配置（与 test2-7 共享 test-core-bundle.js）
  for (let i = 8; i <= 81; i++) {
    bundleConfigs[`pages/test${i}.html`] = {
      bundleName: 'test-core-bundle.js',
      scripts: ['js/test-renderer.js', 'js/test-init.js']
    };
  }

  const generatedBundles = new Map(); // bundleName -> content

  return {
    name: 'bundle-scripts',
    apply: 'build', // 仅在构建模式下生效

    // 在构建开始时生成 bundle 文件
    buildStart() {
      const assetsDir = resolve(__dirname, 'assets');
      if (!existsSync(assetsDir)) {
        mkdirSync(assetsDir, { recursive: true });
      }

      for (const [htmlPath, config] of Object.entries(bundleConfigs)) {
        if (generatedBundles.has(config.bundleName)) continue;

        const parts = config.scripts.map(scriptPath => {
          const fullPath = resolve(__dirname, scriptPath);
          try {
            const content = readFileSync(fullPath, 'utf-8');
            // 用 IIFE 包裹每个文件避免变量冲突
            return `// --- ${scriptPath} ---\n;(function(){\n${content}\n})();\n`;
          } catch (e) {
            console.warn(`⚠️ bundle: 无法读取 ${scriptPath}: ${e.message}`);
            return `// --- ${scriptPath} (missing) ---\n`;
          }
        });

        const bundleContent = `/* Auto-generated bundle: ${config.bundleName} */\n${parts.join('\n')}`;
        const bundlePath = resolve(assetsDir, config.bundleName);
        writeFileSync(bundlePath, bundleContent, 'utf-8');
        generatedBundles.set(config.bundleName, true);
        console.log(`📦 已生成 bundle: assets/${config.bundleName} (${config.scripts.length} 个脚本)`);
      }
    },

    // 构建完成后将 bundle 文件复制到 dist/assets/
    closeBundle() {
      const srcDir = resolve(__dirname, 'assets');
      const destDir = resolve(__dirname, 'dist/assets');
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      for (const bundleName of generatedBundles.keys()) {
        const src = resolve(srcDir, bundleName);
        const dest = resolve(destDir, bundleName);
        if (existsSync(src)) {
          cpSync(src, dest);
          console.log(`📦 已复制 bundle 到 dist: assets/${bundleName}`);
        }
      }
    },

    // 转换 HTML：将多个 script 标签替换为单个 bundle 引用
    transformIndexHtml(html, ctx) {
      // 找到匹配的配置 - 使用精确文件名匹配
      let matchedConfig = null;
      const ctxBasename = ctx.filename ? ctx.filename.split('/').pop() : '';
      for (const [htmlPath, config] of Object.entries(bundleConfigs)) {
        const configBasename = htmlPath.split('/').pop();
        if (ctxBasename === configBasename) {
          matchedConfig = config;
          break;
        }
      }

      if (!matchedConfig) return html;

      // 构建要移除的 script src 集合（使用相对路径中的文件名部分匹配）
      const scriptFileNames = matchedConfig.scripts.map(s => s.split('/').pop());

      // 逐行处理 HTML，移除匹配的 script 标签
      const lines = html.split('\n');
      const filteredLines = [];
      let bundleInserted = false;

      for (const line of lines) {
        const scriptMatch = line.match(/<script\s+src=["']([^"']+)["']\s+defer\s*>/i) ||
                           line.match(/<script\s+defer\s+src=["']([^"']+)["']\s*>/i);

        if (scriptMatch) {
          const srcFileName = scriptMatch[1].split('/').pop();
          if (scriptFileNames.includes(srcFileName)) {
            // 在第一次移除时插入 bundle 引用
            if (!bundleInserted) {
              const prefix = ctx.filename && ctx.filename.includes('/pages/') ? '../' : '';
              filteredLines.push(`    <script src="${prefix}assets/${matchedConfig.bundleName}" defer></script>`);
              bundleInserted = true;
            }
            // 跳过这个 script 标签
            continue;
          }
        }
        filteredLines.push(line);
      }

      return filteredLines.join('\n');
    }
  };
}

export default defineConfig({
  // 基础配置
  base: './',

  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    fs: {
      strict: false
    }
  },

  // 预览服务器配置
  preview: {
    port: 8080,
    open: true
  },

  // 插件配置
  plugins: [
    // 传统浏览器支持
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    // 构建时合并JS文件
    bundleScriptsPlugin(),
    // 构建时复制音频文件
    copyAudioPlugin()
  ],
  
  // 静态资源处理
  assetsInclude: ['**/*.mp3', '**/*.m4a', '**/*.webp', '**/*.jpg', '**/*.png'],
  
  // 公共静态资源目录（audio等文件会被原样复制到dist/）
  publicDir: 'public',
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    // 不对audio等大文件做内联处理
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        test: resolve(__dirname, 'pages/test.html'),
        test1: resolve(__dirname, 'pages/test1.html'),
        'enhanced-test1': resolve(__dirname, 'pages/enhanced-test1.html'),
        test2: resolve(__dirname, 'pages/test2.html'),
        test3: resolve(__dirname, 'pages/test3.html'),
        test4: resolve(__dirname, 'pages/test4.html'),
        test5: resolve(__dirname, 'pages/test5.html'),
        test6: resolve(__dirname, 'pages/test6.html'),
        test7: resolve(__dirname, 'pages/test7.html'),
        practice: resolve(__dirname, 'pages/practice.html'),
        scoring: resolve(__dirname, 'pages/scoring.html'),
        cases: resolve(__dirname, 'pages/cases.html'),
        'score-result': resolve(__dirname, 'pages/score-result.html'),
        'score-validator': resolve(__dirname, 'pages/score-validator.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        'privacy-en': resolve(__dirname, 'privacy-en.html'),
        terms: resolve(__dirname, 'terms.html'),
        'terms-en': resolve(__dirname, 'terms-en.html'),
        about: resolve(__dirname, 'about.html'),
        'about-en': resolve(__dirname, 'about-en.html'),
        contact: resolve(__dirname, 'contact.html'),
        'contact-en': resolve(__dirname, 'contact-en.html'),
        // 动态添加 test8-test75 页面
        ...Object.fromEntries(
          readdirSync(resolve(__dirname, 'pages'))
            .filter(f => /^test\d+\.html$/.test(f) && parseInt(f.match(/\d+/)[0]) >= 8)
            .map(f => {
              const num = f.match(/\d+/)[0];
              return [`test${num}`, resolve(__dirname, `pages/${f}`)];
            })
        ),
      }
    }
  },
  
  // 优化配置
  optimizeDeps: {
    exclude: ['js/mobile-performance-integration.js', 'js/battery-performance-manager.js']
  }
});