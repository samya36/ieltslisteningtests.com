import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';
import { cpSync } from 'fs';

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
      }
    }
  },
  
  // 优化配置
  optimizeDeps: {
    exclude: ['js/mobile-performance-integration.js', 'js/battery-performance-manager.js']
  }
});