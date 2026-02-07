import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

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
    })
  ],
  
  // 静态资源处理
  assetsInclude: ['**/*.mp3', '**/*.m4a', '**/*.webp', '**/*.jpg', '**/*.png'],
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        test: resolve(__dirname, 'pages/test.html'),
        test2: resolve(__dirname, 'pages/test2.html'),
        test3: resolve(__dirname, 'pages/test3.html'),
        practice: resolve(__dirname, 'pages/practice.html'),
        scoring: resolve(__dirname, 'pages/scoring.html'),
        cases: resolve(__dirname, 'pages/cases.html'),
      }
    }
  },
  
  // 优化配置
  optimizeDeps: {
    exclude: ['js/mobile-performance-integration.js', 'js/battery-performance-manager.js']
  }
});