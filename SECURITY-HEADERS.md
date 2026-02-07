# 🔒 雅思听力测试网站安全HTTP头配置说明

## 概述

本文档详细说明了为雅思听力测试网站实施的安全HTTP头配置，以防护常见的Web安全威胁。

## 已实施的安全头

### 1. Content Security Policy (CSP)

**作用**: 防止XSS攻击和代码注入

**配置内容**:
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    font-src 'self' https://cdnjs.cloudflare.com data:;
    img-src 'self' data: blob:;
    audio-src 'self' data: blob:;
    connect-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
">
```

**策略说明**:
- `default-src 'self'`: 默认只允许同源资源
- `script-src`: 允许自身域名、内联脚本（测试页面需要）、cdnjs.cloudflare.com
- `style-src`: 允许自身域名、内联样式、cdnjs.cloudflare.com
- `font-src`: 允许字体资源从自身域名、CDN和data URLs加载
- `img-src`: 允许图片从自身域名、data URLs和blob URLs加载
- `audio-src`: 允许音频文件从自身域名、data URLs和blob URLs加载
- `object-src 'none'`: 禁止嵌入对象（Flash等）
- `frame-ancestors 'none'`: 禁止页面被嵌入到iframe中
- `upgrade-insecure-requests`: 自动将HTTP请求升级为HTTPS

### 2. X-Frame-Options

**作用**: 防止点击劫持攻击

**配置**:
```html
<meta http-equiv="X-Frame-Options" content="DENY">
```

**说明**: 完全禁止页面被嵌入到任何iframe中

### 3. X-Content-Type-Options

**作用**: 防止MIME类型嗅探攻击

**配置**:
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

**说明**: 强制浏览器严格按照Content-Type头部处理资源

### 4. Referrer-Policy

**作用**: 控制引用信息泄露

**配置**:
```html
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
```

**说明**: 
- 同源请求: 发送完整的referrer
- 跨源请求: 只发送origin部分
- HTTPS→HTTP: 不发送referrer

### 5. X-XSS-Protection

**作用**: 启用浏览器的XSS过滤器（向后兼容）

**配置**:
```html
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

**说明**: 启用XSS过滤器，发现攻击时阻止页面渲染

### 6. Permissions-Policy

**作用**: 控制浏览器功能权限

**配置**:
```html
<meta http-equiv="Permissions-Policy" content="
    geolocation=(),
    microphone=(),
    camera=(),
    payment=(),
    usb=(),
    magnetometer=(),
    gyroscope=(),
    accelerometer=()
">
```

**说明**: 禁用不需要的浏览器API，减少攻击面

## 子资源完整性 (SRI) 配置

### Font Awesome CDN资源

**配置**:
```html
<link rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
      crossorigin="anonymous" 
      referrerpolicy="no-referrer">
```

**安全特性**:
- `integrity`: SHA512哈希值验证文件完整性
- `crossorigin="anonymous"`: 启用CORS验证
- `referrerpolicy="no-referrer"`: 不发送referrer信息

## 文件应用状态

| 文件 | CSP | X-Frame-Options | X-Content-Type-Options | SRI | 状态 |
|------|-----|----------------|----------------------|-----|------|
| index.html | ✅ | ✅ | ✅ | N/A | 完成 |
| pages/test.html | ✅ | ✅ | ✅ | ✅ | 完成 |
| pages/test2.html | ✅ | ✅ | ✅ | ✅ | 完成 |
| pages/test3.html | ✅ | ✅ | ✅ | ✅ | 完成 |
| pages/scoring.html | ✅ | ✅ | ✅ | N/A | 完成 |

## 安全验证工具

### 自动化验证脚本

位置: `scripts/security-headers-validator.js`

**运行方式**:
```bash
node scripts/security-headers-validator.js
```

**功能**:
- 检查所有HTML文件的安全头配置
- 验证CDN资源的SRI配置
- 生成详细的安全报告
- 提供修复建议

### 手动验证方法

1. **浏览器开发者工具**:
   - 打开Network标签
   - 查看Response Headers
   - 确认安全头是否存在

2. **在线安全检测**:
   - [Mozilla Observatory](https://observatory.mozilla.org/)
   - [Security Headers](https://securityheaders.com/)

## 部署注意事项

### 服务器级别配置

虽然我们在HTML中配置了安全头，但建议在服务器配置中也添加相同的头部作为双重保护：

**Apache (.htaccess)**:
```apache
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set X-XSS-Protection "1; mode=block"
```

**Nginx**:
```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### CDN配置

如果使用CDN服务，确保：
1. 启用HTTPS
2. 配置适当的缓存策略
3. 启用Brotli/Gzip压缩
4. 设置适当的CORS头部

## 维护和更新

### 定期检查

1. **每月运行安全验证脚本**
2. **检查CDN资源的SRI哈希值是否需要更新**
3. **关注新的安全威胁和最佳实践**

### 更新流程

1. 修改安全头配置
2. 运行验证脚本确认配置正确
3. 在测试环境验证功能正常
4. 部署到生产环境
5. 使用在线工具验证配置生效

## 安全效果评估

实施这些安全头后，网站将获得以下防护：

- ✅ **XSS攻击防护**: CSP策略阻止未授权脚本执行
- ✅ **点击劫持防护**: X-Frame-Options阻止恶意嵌入
- ✅ **MIME嗅探防护**: X-Content-Type-Options防止类型混淆攻击
- ✅ **信息泄露防护**: Referrer-Policy控制引用信息
- ✅ **完整性保护**: SRI确保CDN资源未被篡改
- ✅ **权限控制**: Permissions-Policy限制API访问

## 联系和支持

如有安全相关问题或建议，请通过以下方式联系：
- 创建GitHub Issue
- 发送邮件至安全团队

---

*最后更新: 2024年*
*版本: 1.0*