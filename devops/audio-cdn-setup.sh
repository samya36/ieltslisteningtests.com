#!/bin/bash

# 音频CDN自动化部署脚本
# 支持Cloudflare和AWS CloudFront配置

set -e

# 配置变量
CLOUDFLARE_ZONE_ID="${CLOUDFLARE_ZONE_ID}"
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID}"
DOMAIN_NAME="${DOMAIN_NAME:-ielts-listening.com}"

# 日志配置
LOG_FILE="cdn-setup-$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE")
exec 2>&1

echo "=== 音频CDN部署开始 ===" 
echo "时间: $(date)"
echo "域名: $DOMAIN_NAME"

# 函数：检查依赖
check_dependencies() {
    echo "检查依赖工具..."
    
    if ! command -v aws &> /dev/null; then
        echo "错误: AWS CLI未安装"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        echo "错误: curl未安装"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo "错误: jq未安装"
        exit 1
    fi
    
    echo "✓ 依赖检查完成"
}

# 函数：配置Cloudflare CDN
setup_cloudflare_cdn() {
    echo "配置Cloudflare CDN..."
    
    # 创建页面规则 - 音频文件缓存
    AUDIO_CACHE_RULE=$(cat <<EOF
{
    "targets": [{
        "target": "url",
        "constraint": {
            "operator": "matches",
            "value": "*${DOMAIN_NAME}/audio/*"
        }
    }],
    "actions": [{
        "id": "cache_level",
        "value": "cache_everything"
    }, {
        "id": "edge_cache_ttl",
        "value": 604800
    }, {
        "id": "browser_cache_ttl",
        "value": 86400
    }]
}
EOF
)

    curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/pagerules" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "$AUDIO_CACHE_RULE"

    # 启用Brotli压缩
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/settings/brotli" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}'

    # 配置智能路由
    curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/settings/argo_smart_routing" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"value":"on"}'

    echo "✓ Cloudflare CDN配置完成"
}

# 函数：配置AWS CloudFront
setup_cloudfront_cdn() {
    echo "配置AWS CloudFront分发..."
    
    # 创建CloudFront分发配置
    DISTRIBUTION_CONFIG=$(cat <<EOF
{
    "CallerReference": "ielts-audio-$(date +%s)",
    "Comment": "IELTS Audio Files Distribution",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [{
            "Id": "S3-ielts-audio",
            "DomainName": "${DOMAIN_NAME}",
            "CustomOriginConfig": {
                "HTTPPort": 80,
                "HTTPSPort": 443,
                "OriginProtocolPolicy": "https-only"
            }
        }]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-ielts-audio",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {"Forward": "none"}
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "CacheBehaviors": {
        "Quantity": 1,
        "Items": [{
            "PathPattern": "/audio/*",
            "TargetOriginId": "S3-ielts-audio",
            "ViewerProtocolPolicy": "redirect-to-https",
            "MinTTL": 0,
            "DefaultTTL": 604800,
            "MaxTTL": 31536000,
            "ForwardedValues": {
                "QueryString": false,
                "Cookies": {"Forward": "none"},
                "Headers": {
                    "Quantity": 1,
                    "Items": ["Range"]
                }
            },
            "Compress": true
        }]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_All"
}
EOF
)

    aws cloudfront create-distribution \
        --distribution-config "$DISTRIBUTION_CONFIG" \
        --output json > cloudfront-distribution.json

    DISTRIBUTION_ID=$(jq -r '.Distribution.Id' cloudfront-distribution.json)
    echo "CloudFront分发ID: $DISTRIBUTION_ID"
    
    echo "✓ AWS CloudFront配置完成"
}

# 函数：上传音频文件到S3
upload_audio_to_s3() {
    echo "上传音频文件到S3..."
    
    BUCKET_NAME="ielts-audio-${AWS_ACCOUNT_ID}"
    
    # 创建S3存储桶
    aws s3 mb s3://"$BUCKET_NAME" || true
    
    # 配置存储桶策略 - 公开读取
    BUCKET_POLICY=$(cat <<EOF
{
    "Version": "2012-10-17",
    "Statement": [{
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }]
}
EOF
)

    echo "$BUCKET_POLICY" > bucket-policy.json
    aws s3api put-bucket-policy \
        --bucket "$BUCKET_NAME" \
        --policy file://bucket-policy.json

    # 上传音频文件
    if [ -d "../audio" ]; then
        aws s3 sync ../audio s3://"$BUCKET_NAME"/audio \
            --delete \
            --cache-control "max-age=604800" \
            --metadata-directive REPLACE
        echo "✓ 音频文件上传完成"
    else
        echo "警告: 未找到audio目录"
    fi
}

# 函数：配置域名解析
setup_dns() {
    echo "配置DNS解析..."
    
    # 获取CloudFront域名
    if [ -f "cloudfront-distribution.json" ]; then
        CF_DOMAIN=$(jq -r '.Distribution.DomainName' cloudfront-distribution.json)
        
        # 创建CNAME记录指向CloudFront
        curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records" \
            -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
            -H "Content-Type: application/json" \
            --data "{
                \"type\": \"CNAME\",
                \"name\": \"cdn\",
                \"content\": \"${CF_DOMAIN}\",
                \"ttl\": 1
            }"
        
        echo "✓ DNS配置完成: cdn.${DOMAIN_NAME} -> ${CF_DOMAIN}"
    fi
}

# 函数：验证CDN配置
validate_cdn_setup() {
    echo "验证CDN配置..."
    
    # 测试音频文件访问
    AUDIO_URL="https://cdn.${DOMAIN_NAME}/audio/test1/section1.mp3"
    
    echo "测试音频文件访问: $AUDIO_URL"
    
    HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" -I "$AUDIO_URL")
    
    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "206" ]; then
        echo "✓ 音频文件访问测试通过"
    else
        echo "❌ 音频文件访问失败，HTTP状态码: $HTTP_STATUS"
        return 1
    fi
    
    # 测试Range请求支持
    RANGE_STATUS=$(curl -o /dev/null -s -w "%{http_code}" -H "Range: bytes=0-1023" "$AUDIO_URL")
    
    if [ "$RANGE_STATUS" = "206" ]; then
        echo "✓ Range请求支持测试通过"
    else
        echo "❌ Range请求不支持，HTTP状态码: $RANGE_STATUS"
    fi
    
    # 测试缓存头
    CACHE_HEADERS=$(curl -s -I "$AUDIO_URL" | grep -i cache)
    echo "缓存头信息: $CACHE_HEADERS"
}

# 函数：生成配置报告
generate_report() {
    echo "生成配置报告..."
    
    REPORT_FILE="cdn-deployment-report.md"
    cat > "$REPORT_FILE" <<EOF
# CDN部署报告

## 部署信息
- 时间: $(date)
- 域名: $DOMAIN_NAME
- 配置文件: $LOG_FILE

## CDN配置
- 主要提供商: Cloudflare
- 备用提供商: AWS CloudFront
- 音频缓存TTL: 7天
- 静态资源缓存TTL: 30天

## 访问端点
- 主站: https://$DOMAIN_NAME
- CDN: https://cdn.$DOMAIN_NAME
- 音频文件: https://cdn.$DOMAIN_NAME/audio/

## 性能优化
- 启用Brotli压缩
- 启用智能路由
- 支持Range请求
- 全球边缘节点部署

## 下一步
1. 监控缓存命中率
2. 优化缓存策略
3. 性能测试和调优
4. 成本分析和优化
EOF

    echo "✓ 配置报告已生成: $REPORT_FILE"
}

# 主流程
main() {
    echo "开始CDN自动化部署..."
    
    check_dependencies
    setup_cloudflare_cdn
    upload_audio_to_s3
    setup_cloudfront_cdn
    setup_dns
    
    # 等待DNS传播
    echo "等待DNS传播..."
    sleep 60
    
    validate_cdn_setup
    generate_report
    
    echo "=== CDN部署完成 ==="
    echo "请查看报告: cdn-deployment-report.md"
}

# 执行主流程
main "$@"