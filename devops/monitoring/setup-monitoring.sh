#!/bin/bash
# 监控系统设置脚本
# 配置CloudWatch告警、仪表板和日志聚合

set -euo pipefail

# 配置变量
ENVIRONMENT="${ENVIRONMENT:-production}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID}"
S3_BUCKET_NAME="${S3_BUCKET_NAME}"
AWS_REGION="${AWS_REGION:-ap-southeast-1}"
SNS_TOPIC_NAME="ielts-alerts-${ENVIRONMENT}"
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 创建SNS主题用于告警
create_sns_topic() {
    log "Creating SNS topic for alerts..."
    
    SNS_TOPIC_ARN=$(aws sns create-topic \
        --name "$SNS_TOPIC_NAME" \
        --query 'TopicArn' \
        --output text)
    
    log "SNS Topic created: $SNS_TOPIC_ARN"
    
    # 配置Slack集成
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        log "Setting up Slack integration..."
        
        # 创建Lambda函数用于Slack通知
        cat > slack-notifier.py << 'EOF'
import json
import urllib3
import os

def lambda_handler(event, context):
    http = urllib3.PoolManager()
    
    # 解析SNS消息
    message = json.loads(event['Records'][0]['Sns']['Message'])
    
    slack_message = {
        "text": f"🚨 IELTS Website Alert",
        "attachments": [
            {
                "color": "danger" if message['NewStateValue'] == 'ALARM' else "good",
                "fields": [
                    {
                        "title": "Alarm Name",
                        "value": message['AlarmName'],
                        "short": True
                    },
                    {
                        "title": "State",
                        "value": message['NewStateValue'],
                        "short": True
                    },
                    {
                        "title": "Reason",
                        "value": message['NewStateReason'],
                        "short": False
                    }
                ],
                "ts": int(message['StateChangeTime'])
            }
        ]
    }
    
    encoded_msg = json.dumps(slack_message).encode('utf-8')
    
    resp = http.request(
        'POST',
        os.environ['SLACK_WEBHOOK_URL'],
        body=encoded_msg,
        headers={'Content-Type': 'application/json'}
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Success')
    }
EOF
        
        # 打包Lambda函数
        zip -r slack-notifier.zip slack-notifier.py
        
        # 创建Lambda函数
        LAMBDA_ARN=$(aws lambda create-function \
            --function-name "ielts-slack-notifier-${ENVIRONMENT}" \
            --runtime python3.9 \
            --role "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role" \
            --handler slack-notifier.lambda_handler \
            --zip-file fileb://slack-notifier.zip \
            --environment Variables="{SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL}" \
            --query 'FunctionArn' \
            --output text)
        
        # 订阅SNS主题
        aws sns subscribe \
            --topic-arn "$SNS_TOPIC_ARN" \
            --protocol lambda \
            --notification-endpoint "$LAMBDA_ARN"
        
        # 给SNS权限调用Lambda
        aws lambda add-permission \
            --function-name "ielts-slack-notifier-${ENVIRONMENT}" \
            --statement-id allow-sns \
            --action lambda:InvokeFunction \
            --principal sns.amazonaws.com \
            --source-arn "$SNS_TOPIC_ARN"
        
        log "Slack integration configured"
    fi
    
    echo "$SNS_TOPIC_ARN"
}

# 创建CloudWatch告警
create_cloudwatch_alarms() {
    local sns_topic_arn="$1"
    
    log "Creating CloudWatch alarms..."
    
    # CDN缓存命中率告警
    aws cloudwatch put-metric-alarm \
        --alarm-name "IELTS-CacheHitRate-Low-${ENVIRONMENT}" \
        --alarm-description "CDN cache hit rate is below 85%" \
        --metric-name CacheHitRate \
        --namespace AWS/CloudFront \
        --statistic Average \
        --period 300 \
        --threshold 85 \
        --comparison-operator LessThanThreshold \
        --evaluation-periods 2 \
        --alarm-actions "$sns_topic_arn" \
        --dimensions Name=DistributionId,Value="$CLOUDFRONT_DISTRIBUTION_ID"
    
    # 4xx错误率告警
    aws cloudwatch put-metric-alarm \
        --alarm-name "IELTS-4xxErrorRate-High-${ENVIRONMENT}" \
        --alarm-description "4xx error rate is above 5%" \
        --metric-name 4xxErrorRate \
        --namespace AWS/CloudFront \
        --statistic Average \
        --period 300 \
        --threshold 5 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 2 \
        --alarm-actions "$sns_topic_arn" \
        --dimensions Name=DistributionId,Value="$CLOUDFRONT_DISTRIBUTION_ID"
    
    # 5xx错误率告警
    aws cloudwatch put-metric-alarm \
        --alarm-name "IELTS-5xxErrorRate-High-${ENVIRONMENT}" \
        --alarm-description "5xx error rate is above 1%" \
        --metric-name 5xxErrorRate \
        --namespace AWS/CloudFront \
        --statistic Average \
        --period 300 \
        --threshold 1 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 2 \
        --alarm-actions "$sns_topic_arn" \
        --dimensions Name=DistributionId,Value="$CLOUDFRONT_DISTRIBUTION_ID"
    
    # 源服务器延迟告警
    aws cloudwatch put-metric-alarm \
        --alarm-name "IELTS-OriginLatency-High-${ENVIRONMENT}" \
        --alarm-description "Origin latency is above 5 seconds" \
        --metric-name OriginLatency \
        --namespace AWS/CloudFront \
        --statistic Average \
        --period 300 \
        --threshold 5000 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 3 \
        --alarm-actions "$sns_topic_arn" \
        --dimensions Name=DistributionId,Value="$CLOUDFRONT_DISTRIBUTION_ID"
    
    # S3错误告警
    aws cloudwatch put-metric-alarm \
        --alarm-name "IELTS-S3-Errors-High-${ENVIRONMENT}" \
        --alarm-description "S3 4xx errors are increasing" \
        --metric-name 4xxErrors \
        --namespace AWS/S3 \
        --statistic Sum \
        --period 300 \
        --threshold 10 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 2 \
        --alarm-actions "$sns_topic_arn" \
        --dimensions Name=BucketName,Value="$S3_BUCKET_NAME"
    
    log "CloudWatch alarms created"
}

# 创建自定义指标
setup_custom_metrics() {
    log "Setting up custom metrics..."
    
    # 创建前端性能监控脚本
    cat > ../js/performance-monitor.js << 'EOF'
// 前端性能监控
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.isEnabled = true;
        
        // 初始化监控
        this.initializeMonitoring();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    initializeMonitoring() {
        // 监控页面加载性能
        window.addEventListener('load', () => {
            setTimeout(() => this.reportPageLoad(), 1000);
        });
        
        // 监控音频加载性能
        this.monitorAudioLoading();
        
        // 监控用户交互
        this.monitorUserInteractions();
        
        // 定期报告指标
        setInterval(() => this.reportMetrics(), 30000); // 每30秒报告一次
    }
    
    reportPageLoad() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
            pageLoadTime: navigation.loadEventEnd - navigation.navigationStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.sendMetric('PageLoad', metrics);
    }
    
    monitorAudioLoading() {
        // 重写Audio构造函数以监控音频加载
        const originalAudio = window.Audio;
        const self = this;
        
        window.Audio = function(src) {
            const audio = new originalAudio(src);
            const startTime = Date.now();
            
            audio.addEventListener('loadstart', () => {
                self.metrics[`audio_${src}`] = { startTime: Date.now() };
            });
            
            audio.addEventListener('canplaythrough', () => {
                const loadTime = Date.now() - startTime;
                self.sendMetric('AudioLoad', {
                    src: src,
                    loadTime: loadTime,
                    timestamp: Date.now(),
                    sessionId: self.sessionId
                });
            });
            
            audio.addEventListener('error', (e) => {
                self.sendMetric('AudioError', {
                    src: src,
                    error: e.message,
                    timestamp: Date.now(),
                    sessionId: self.sessionId
                });
            });
            
            return audio;
        };
    }
    
    monitorUserInteractions() {
        // 监控测试开始
        document.addEventListener('click', (e) => {
            if (e.target.matches('[href*="test"], .test-start, .btn-primary')) {
                this.sendMetric('TestStart', {
                    buttonText: e.target.textContent.trim(),
                    timestamp: Date.now(),
                    sessionId: this.sessionId
                });
            }
        });
        
        // 监控答题完成
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Date.now() - this.startTime;
            this.sendMetric('SessionEnd', {
                duration: sessionDuration,
                timestamp: Date.now(),
                sessionId: this.sessionId
            });
        });
    }
    
    sendMetric(metricName, data) {
        if (!this.isEnabled) return;
        
        // 发送到CloudWatch（通过API Gateway + Lambda）
        const payload = {
            MetricName: metricName,
            Namespace: 'Custom/IELTS',
            Environment: '{{ENVIRONMENT}}',
            Data: data
        };
        
        fetch('/api/metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).catch(error => {
            console.warn('Failed to send metric:', error);
        });
    }
    
    reportMetrics() {
        // 报告当前活跃用户
        this.sendMetric('ActiveUser', {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            page: window.location.pathname
        });
    }
}

// 初始化性能监控
if (typeof window !== 'undefined') {
    window.performanceMonitor = new PerformanceMonitor();
}
EOF
    
    log "Custom metrics setup completed"
}

# 创建CloudWatch仪表板
create_dashboard() {
    log "Creating CloudWatch dashboard..."
    
    # 替换模板变量
    sed -e "s/\${CLOUDFRONT_DISTRIBUTION_ID}/$CLOUDFRONT_DISTRIBUTION_ID/g" \
        -e "s/\${S3_BUCKET_NAME}/$S3_BUCKET_NAME/g" \
        -e "s/\${AWS_REGION}/$AWS_REGION/g" \
        -e "s/\${ENVIRONMENT}/$ENVIRONMENT/g" \
        cloudwatch-dashboard.json > dashboard-config.json
    
    # 创建仪表板
    aws cloudwatch put-dashboard \
        --dashboard-name "IELTS-Website-${ENVIRONMENT}" \
        --dashboard-body file://dashboard-config.json
    
    log "Dashboard created: IELTS-Website-${ENVIRONMENT}"
}

# 设置日志聚合
setup_log_aggregation() {
    log "Setting up log aggregation..."
    
    # 创建CloudWatch Logs组
    aws logs create-log-group \
        --log-group-name "/ielts/application/${ENVIRONMENT}" \
        --retention-in-days 30 || true
    
    aws logs create-log-group \
        --log-group-name "/ielts/access/${ENVIRONMENT}" \
        --retention-in-days 7 || true
    
    # 创建日志流
    aws logs create-log-stream \
        --log-group-name "/ielts/application/${ENVIRONMENT}" \
        --log-stream-name "frontend-errors" || true
    
    aws logs create-log-stream \
        --log-group-name "/ielts/application/${ENVIRONMENT}" \
        --log-stream-name "performance-metrics" || true
    
    # 创建MetricFilter
    aws logs put-metric-filter \
        --log-group-name "/ielts/application/${ENVIRONMENT}" \
        --filter-name "ErrorCount" \
        --filter-pattern "ERROR" \
        --metric-transformations \
            metricName=ErrorCount,metricNamespace=Custom/IELTS,metricValue=1,defaultValue=0
    
    aws logs put-metric-filter \
        --log-group-name "/ielts/application/${ENVIRONMENT}" \
        --filter-name "AudioLoadTime" \
        --filter-pattern "[timestamp, requestId, \"AUDIO_LOAD\", loadTime]" \
        --metric-transformations \
            metricName=AudioLoadTime,metricNamespace=Custom/IELTS,metricValue=\$loadTime
    
    log "Log aggregation configured"
}

# 创建健康检查端点
create_health_check() {
    log "Creating health check endpoint..."
    
    cat > ../health.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>IELTS Website Health Check</title>
    <meta charset="utf-8">
</head>
<body>
    <script>
        // 健康检查脚本
        const healthCheck = {
            timestamp: new Date().toISOString(),
            status: 'OK',
            version: '1.0',
            environment: '{{ENVIRONMENT}}',
            checks: {
                staticAssets: false,
                audioAssets: false,
                frontend: false
            }
        };
        
        // 检查静态资源
        fetch('css/main.css', { method: 'HEAD' })
            .then(response => {
                healthCheck.checks.staticAssets = response.ok;
                return fetch('js/main.js', { method: 'HEAD' });
            })
            .then(response => {
                healthCheck.checks.frontend = response.ok;
                return fetch('audio/test1/section1.mp3', { 
                    method: 'HEAD',
                    headers: { 'Range': 'bytes=0-1024' }
                });
            })
            .then(response => {
                healthCheck.checks.audioAssets = response.status === 206 || response.ok;
                
                // 计算总体状态
                const allChecksPass = Object.values(healthCheck.checks).every(check => check);
                healthCheck.status = allChecksPass ? 'OK' : 'DEGRADED';
                
                // 显示结果
                document.body.innerHTML = `
                    <h1>Health Check: ${healthCheck.status}</h1>
                    <pre>${JSON.stringify(healthCheck, null, 2)}</pre>
                `;
                
                // 设置HTTP状态码
                if (!allChecksPass) {
                    console.error('Health check failed:', healthCheck);
                }
            })
            .catch(error => {
                healthCheck.status = 'ERROR';
                healthCheck.error = error.message;
                document.body.innerHTML = `
                    <h1>Health Check: ERROR</h1>
                    <pre>${JSON.stringify(healthCheck, null, 2)}</pre>
                `;
            });
    </script>
</body>
</html>
EOF
    
    log "Health check endpoint created"
}

# 主函数
main() {
    log "Setting up monitoring for IELTS website..."
    
    # 创建SNS主题
    SNS_TOPIC_ARN=$(create_sns_topic)
    
    # 创建CloudWatch告警
    create_cloudwatch_alarms "$SNS_TOPIC_ARN"
    
    # 设置自定义指标
    setup_custom_metrics
    
    # 创建仪表板
    create_dashboard
    
    # 设置日志聚合
    setup_log_aggregation
    
    # 创建健康检查
    create_health_check
    
    log "Monitoring setup completed successfully!"
    log "Dashboard URL: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=IELTS-Website-${ENVIRONMENT}"
    log "SNS Topic ARN: $SNS_TOPIC_ARN"
}

# 执行主函数
main "$@"