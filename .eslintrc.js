module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: false
  },
  
  extends: [
    'eslint:recommended'
  ],
  
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script'
  },
  
  globals: {
    // 全局变量定义
    'window': 'readonly',
    'document': 'readonly',
    'console': 'readonly',
    
    // 项目特定全局变量
    'TEST_DATA': 'readonly',
    'ANSWERS': 'readonly',
    'TestUI': 'writable',
    'testUI': 'writable',
    'secureStorage': 'readonly',
    'progressManager': 'readonly',
    'modernAudioManager': 'readonly',
    'mobileAudioOptimizer': 'readonly',
    'batteryPerformanceManager': 'readonly',
    'swManager': 'readonly'
  },
  
  rules: {
    // 代码质量规则
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-redeclare': 'error',
    
    // 代码风格规则
    'indent': ['error', 4],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    
    // ES6+ 规则
    'prefer-const': 'warn',
    'no-var': 'warn',
    'prefer-arrow-callback': 'warn',
    'arrow-spacing': 'error',
    
    // 最佳实践
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-with': 'error',
    'no-loop-func': 'error',
    'no-new-func': 'error',
    
    // 错误预防
    'no-cond-assign': 'error',
    'no-constant-condition': 'error',
    'no-duplicate-keys': 'error',
    'no-empty': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-semi': 'error',
    'no-func-assign': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-unreachable': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error'
  },
  
  // 忽略模式
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.min.js',
    'sw.js',
    'audio_backups/',
    'logs/',
    '剑桥雅思20/'
  ]
};