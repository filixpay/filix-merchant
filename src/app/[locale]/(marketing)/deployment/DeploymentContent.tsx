"use client";

import styles from '@/components/marketing/marketing.module.css';

export default function DeploymentContent() {
    return (
        <>
            <section className={styles.pageHero}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroBadge}>DEPLOYMENT</div>
                    <h1 className={styles.heroTitle}>FilixPay 私有化部署文档</h1>
                    <p className={styles.heroSubtitle}>
                        基于 Docker 架构的一键式容器化部署方案，快速搭建商户支付平台
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <article className="whitepaper-content">
                        <style jsx>{`
                            .whitepaper-content {
                                max-width: 860px;
                                margin: 0 auto;
                                color: #334155;
                                font-size: 16px;
                                line-height: 1.85;
                            }
                            .whitepaper-content h2 {
                                font-size: 28px;
                                font-weight: 800;
                                color: #0f172a;
                                margin: 56px 0 20px;
                                padding-bottom: 12px;
                                border-bottom: 2px solid #e2e8f0;
                                letter-spacing: -0.01em;
                            }
                            .whitepaper-content h2:first-child {
                                margin-top: 0;
                            }
                            .whitepaper-content h3 {
                                font-size: 20px;
                                font-weight: 700;
                                color: #1e293b;
                                margin: 36px 0 12px;
                            }
                            .whitepaper-content h4 {
                                font-size: 17px;
                                font-weight: 600;
                                color: #334155;
                                margin: 24px 0 8px;
                            }
                            .whitepaper-content p {
                                margin: 12px 0;
                            }
                            .whitepaper-content ul, .whitepaper-content ol {
                                margin: 12px 0;
                                padding-left: 24px;
                            }
                            .whitepaper-content li {
                                margin: 6px 0;
                            }
                            .whitepaper-content strong {
                                color: #0f172a;
                            }
                            .whitepaper-content a {
                                color: #3b82f6;
                                text-decoration: none;
                                font-weight: 500;
                                transition: color 0.2s;
                            }
                            .whitepaper-content a:hover {
                                color: #2563eb;
                                text-decoration: underline;
                            }
                            .whitepaper-content code {
                                background: #f1f5f9;
                                color: #e11d48;
                                padding: 2px 6px;
                                border-radius: 4px;
                                font-size: 14px;
                            }
                            .whitepaper-content pre {
                                background: #0f172a;
                                color: #f8fafc;
                                padding: 16px;
                                border-radius: 8px;
                                overflow-x: auto;
                                font-size: 14px;
                                line-height: 1.5;
                                margin: 16px 0;
                            }
                            .whitepaper-content pre code {
                                background: transparent;
                                color: inherit;
                                padding: 0;
                            }
                            .whitepaper-content blockquote {
                                background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
                                border-left: 4px solid #3b82f6;
                                padding: 16px 20px;
                                margin: 20px 0;
                                border-radius: 0 8px 8px 0;
                                color: #1e40af;
                                font-size: 15px;
                            }
                            .whitepaper-content table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 20px 0;
                                font-size: 15px;
                            }
                            .whitepaper-content th {
                                background: #f8fafc;
                                font-weight: 600;
                                color: #0f172a;
                                text-align: left;
                                padding: 12px 16px;
                                border: 1px solid #e2e8f0;
                            }
                            .whitepaper-content td {
                                padding: 10px 16px;
                                border: 1px solid #e2e8f0;
                                vertical-align: top;
                            }
                            .whitepaper-content hr {
                                border: none;
                                border-top: 1px solid #e2e8f0;
                                margin: 48px 0;
                            }
                            .toc {
                                background: #f8fafc;
                                border: 1px solid #e2e8f0;
                                border-radius: 12px;
                                padding: 24px 32px;
                                margin-bottom: 48px;
                            }
                            .toc h3 {
                                margin-top: 0 !important;
                                font-size: 18px !important;
                                color: #0f172a !important;
                            }
                            .toc ol {
                                columns: 2;
                                column-gap: 32px;
                            }
                            .toc a {
                                color: #475569;
                                font-weight: 400;
                            }
                            .toc a:hover {
                                color: #3b82f6;
                            }
                            .keyword-bar {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 8px;
                                margin-bottom: 40px;
                            }
                            .keyword-tag {
                                background: #eff6ff;
                                color: #3b82f6;
                                padding: 4px 12px;
                                border-radius: 100px;
                                font-size: 12px;
                                font-weight: 600;
                                border: 1px solid #bfdbfe;
                            }
                            @media (max-width: 768px) {
                                .toc ol { columns: 1; }
                                .whitepaper-content h2 { font-size: 22px; }
                                .whitepaper-content h3 { font-size: 18px; }
                            }
                        `}</style>
                        
                        <div className="keyword-bar">
                            {['Docker部署', '私有化部署', 'Docker Compose', 'Redis缓存', 'MySQL', 'Keycloak', '独立网络'].map(tag => (
                                <span key={tag} className="keyword-tag">{tag}</span>
                            ))}
                        </div>

                        <blockquote>
                            <p><strong>项目</strong>：<a href="https://www.filixpay.com">FilixPay</a> 商户支付平台<br />
                            <strong>版本</strong>：v1.0<br />
                            <strong>最后更新</strong>：2026-04-16</p>
                        </blockquote>

                        <p>本文档描述了 FilixPay 平台的完整部署流程，分为三大核心部分：</p>
                        <ul>
                            <li><strong>Part 1 — 商户中心前端部署</strong>：基于 Docker 镜像一键启动商户中心 Web 应用。</li>
                            <li><strong>Part 2 — 收银台前端部署</strong>：基于 Docker 镜像一键启动收银台 Web 应用。</li>
                            <li><strong>Part 3 — 后台服务环境部署</strong>：使用 Docker Compose 部署核心基础设施服务，包括 Redis、MySQL 和 Keycloak。</li>
                            <li><strong>Part 4 — 核心服务部署</strong>：略。</li>
                        </ul>
                        <p>📎 <strong>相关文件</strong>：<a href="/deploy/docker-compose.yml" target="_blank">docker-compose.yml</a> — 点击下载或查看后台服务编排配置。</p>
                        
                        <hr />
                        
                        <h2 id="part-1">Part 1 — 商户中心前端部署</h2>
                        
                        <h3>快速开始</h3>
                        <p>无需下载源码，只需执行一条命令和脚本，即可在本地快速运行体验：</p>
                        
                        <h4>1. 拉取镜像</h4>
                        <pre><code>docker pull ghcr.io/filixpay/filix-merchant:v1.0</code></pre>
                        
                        <h4>2. 一键运行</h4>
                        <p>参考下方商户中心智能启动脚本进行部署。您可以将其保存为 <code>start.sh</code> 直接运行（注：脚本已适配直接拉取镜像的形式，去除了需要源码的构建步骤）。</p>
                        
                        <pre><code>{`#!/bin/bash

# ================= 配置区域 =================
CONTAINER_NAME="filix-merchant"
# 使用直接拉取到的远端镜像
IMAGE_NAME="ghcr.io/filixpay/filix-merchant:v1.0"
ENV_FILE=".env.local"
PORT_HOST=3000
PORT_CONTAINER=3000
# ===========================================

echo "🚀 开始智能部署 [\${CONTAINER_NAME}]..."

# 1. 停止并删除旧容器
echo "🛑 清理旧容器..."
docker rm -f "\${CONTAINER_NAME}" >/dev/null 2>&1 || true

# 2. 启动新容器
echo "📦 正在启动容器 (端口: \${PORT_HOST}:\${PORT_CONTAINER})..."

# 定义基础运行参数数组 (安全且稳健)
RUN_ARGS=(
  -d
  --name "\${CONTAINER_NAME}"
  -p "\${PORT_HOST}:\${PORT_CONTAINER}"
  -e NODE_ENV=production
  -e PORT="\${PORT_CONTAINER}"
  -e HOSTNAME="0.0.0.0"
  # Auth/OIDC — set via --env-file (see .env.example); no production defaults baked in
  -e "NEXTAUTH_URL_INTERNAL=http://localhost:\${PORT_CONTAINER}"
  --restart unless-stopped
)

# 如果存在 .env.local，加入参数
# .env.local 中的变量优先级更高，会覆盖上面的默认值
if [ -f "$ENV_FILE" ]; then
  echo "📄 检测到 $ENV_FILE，将加载环境变量 (优先级最高)..."
  RUN_ARGS+=(--env-file "$ENV_FILE")
else
  echo "⚠️ 未找到 $ENV_FILE，仅使用默认及命令行传递的环境变量..."
  echo "   ⚠️ 警告: 若未设置 KEYCLOAK_CLIENT_SECRET 或 NEXTAUTH_SECRET，服务可能无法启动!"
fi

# 最后加上镜像名
RUN_ARGS+=("\${IMAGE_NAME}")

# 执行命令
docker run "\${RUN_ARGS[@]}"

# 3. 检查状态
sleep 2
STATUS=$(docker inspect -f '{{.State.Status}}' "\${CONTAINER_NAME}" 2>/dev/null)

if [ "$STATUS" == "running" ]; then
  echo "✅ 容器启动成功！"
  echo ""
  echo "📊 运行信息："
  docker ps --filter "name=\${CONTAINER_NAME}" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
  echo ""
  echo "🔗 访问地址: http://localhost:\${PORT_HOST}"
  echo "💡 查看实时日志: docker logs -f \${CONTAINER_NAME}"
  echo "🧹 提示：如需清理旧镜像节省空间，可运行: docker image prune -f"
else
  echo "❌ 容器启动失败或立即退出！状态: \${STATUS:-'未知'}"
  echo "📝 最后 20 行日志:"
  docker logs --tail 20 "\${CONTAINER_NAME}" 2>/dev/null || echo "无法获取日志（容器可能未创建）"
  
  # 额外提示：如果是密钥缺失导致的失败
  if [ ! -f "$ENV_FILE" ]; then
    echo ""
    echo "💡 建议：请创建 .env.local 文件并填入必要的密钥，例如："
    echo "   KEYCLOAK_CLIENT_SECRET=your_secret_here"
    echo "   NEXTAUTH_SECRET=your_nextauth_secret_here"
  fi
  exit 1
fi
`}</code></pre>

                        <hr />

                        <h2 id="part-2">Part 2 — 收银台前端部署</h2>

                        <h3>快速开始</h3>
                        <p>无需下载源码，只需执行一条命令和脚本，即可在本地快速运行体验：</p>
                        
                        <h4>1. 拉取镜像</h4>
                        <pre><code>docker pull ghcr.io/filixpay/filix-checkout:v1.0</code></pre>
                        
                        <h4>2. 一键运行</h4>
                        <p>参考下方收银台智能启动脚本进行部署。您可以将其保存为 <code>start-checkout.sh</code> 直接运行组件：</p>
                        
                        <pre><code>{`#!/bin/bash

# ================= 配置区域 =================
CONTAINER_NAME="filix-checkout"
IMAGE_NAME="ghcr.io/filixpay/filix-checkout:v1.0"
ENV_FILE=".env.local"
PORT_HOST=3001
PORT_CONTAINER=3001
# ===========================================

echo "🚀 开始智能部署 [\${CONTAINER_NAME}]..."

# 1. 停止并删除旧容器
echo "🛑 清理旧容器..."
docker rm -f "\${CONTAINER_NAME}" >/dev/null 2>&1 || true

# 2. 启动新容器
echo "📦 正在启动容器 (端口: \${PORT_HOST}:\${PORT_CONTAINER})..."

RUN_ARGS=(
  -d
  --name "\${CONTAINER_NAME}"
  -p "\${PORT_HOST}:\${PORT_CONTAINER}"
  -e NODE_ENV=production
  -e PORT="\${PORT_CONTAINER}"
  -e HOSTNAME="0.0.0.0"
  -e "NEXTAUTH_URL_INTERNAL=http://localhost:\${PORT_CONTAINER}"
  --restart unless-stopped
)

if [ -f "$ENV_FILE" ]; then
  echo "📄 检测到 $ENV_FILE，将加载环境变量 (优先级最高)..."
  RUN_ARGS+=(--env-file "$ENV_FILE")
else
  echo "⚠️ 未找到 $ENV_FILE，仅使用默认及命令行传递的环境变量..."
fi

RUN_ARGS+=("\${IMAGE_NAME}")

docker run "\${RUN_ARGS[@]}"

# 3. 检查状态
sleep 2
STATUS=$(docker inspect -f '{{.State.Status}}' "\${CONTAINER_NAME}" 2>/dev/null)

if [ "$STATUS" == "running" ]; then
  echo "✅ 容器启动成功！"
else
  echo "❌ 容器启动失败或立即退出！状态: \${STATUS:-'未知'}"
  exit 1
fi
`}</code></pre>

                        <hr />

                        <h2 id="part-3">Part 3 — 后台服务环境部署</h2>
                        <p>以下内容描述如何使用 Docker Compose 部署 FilixPay 平台的核心基础设施服务，包括 <strong>缓存服务 (Redis)</strong>、<strong>数据库服务 (MySQL)</strong> 以及 <strong>身份认证服务 (Keycloak)</strong>。</p>

                        <h3>1. 前置条件</h3>
                        <h4>1.1 系统要求</h4>
                        <table>
                            <thead><tr><th>项目</th><th>最低要求</th></tr></thead>
                            <tbody>
                                <tr><td>操作系统</td><td>Linux (推荐 Ubuntu 22.04+)</td></tr>
                                <tr><td>Docker</td><td>20.10+</td></tr>
                                <tr><td>Docker Compose</td><td>v2.0+</td></tr>
                                <tr><td>可用内存</td><td>≥ 4 GB</td></tr>
                                <tr><td>可用磁盘</td><td>≥ 20 GB</td></tr>
                            </tbody>
                        </table>

                        <h4>1.2 网络端口</h4>
                        <p>请确保以下端口未被占用且防火墙已放行：</p>
                        <table>
                            <thead><tr><th>端口</th><th>服务</th><th>用途</th></tr></thead>
                            <tbody>
                                <tr><td><code>6379</code></td><td>Redis</td><td>缓存服务</td></tr>
                                <tr><td><code>3306</code></td><td>MySQL</td><td>数据库（可通过 <code>.env</code> 自定义）</td></tr>
                                <tr><td><code>8080</code></td><td>Keycloak</td><td>HTTP（内部/调试）</td></tr>
                                <tr><td><code>8443</code></td><td>Keycloak</td><td>HTTPS（对外服务）</td></tr>
                            </tbody>
                        </table>

                        <h3>2. 目录结构</h3>
                        <p>在部署目录下，需按以下结构提前准备好目录和文件：</p>
                        <pre><code>{`filixpay-deploy/
├── docker-compose.yml          # 编排配置文件
├── .env                        # 环境变量（敏感信息，勿提交版本库）
├── certs/                      # SSL/TLS 证书目录
│   ├── auth.example.com.pem    # Keycloak HTTPS 证书
│   └── auth.example.com.key    # Keycloak HTTPS 私钥
├── redis/
│   └── data/                   # Redis AOF 持久化数据
└── mysql/mysql/
    ├── data/                   # MySQL 数据文件
    ├── conf/                   # MySQL 自定义配置 (*.cnf)
    ├── logs/                   # MySQL 日志输出
    └── init-scripts/           # 首次启动时自动执行的 SQL 脚本`}</code></pre>
                        <blockquote><p><strong>提示</strong>：<code>init-scripts/</code> 目录中的 <code>.sql</code> 或 <code>.sh</code> 文件仅在 MySQL <strong>首次初始化</strong>（<code>data/</code> 目录为空）时自动执行。</p></blockquote>

                        <h3>3. 环境变量配置</h3>
                        <p>在 <code>docker-compose.yml</code> 同级目录下创建 <code>.env</code> 文件：</p>
                        <pre><code>{`# ============ 基础配置 ============
COMPOSE_PROJECT_NAME=filixdb-prod
TZ=Asia/Shanghai

# ============ Redis ============
REDIS_PASSWORD=<替换为安全密码>

# ============ MySQL ============
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=<替换为安全密码>
MYSQL_DATABASE=filixpay

# ============ Keycloak ============
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=<替换为安全密码>
KEYCLOAK_DB_USER=keycloak
KEYCLOAK_DB_PASSWORD=<替换为安全密码>
KEYCLOAK_HOSTNAME=auth.example.com`}</code></pre>

                        <h3>4. 服务架构</h3>
                        <pre><code>{`┌──────────┐     ┌──────────┐     ┌───────────┐
│  Redis   │     │  MySQL   │◄────│ Keycloak  │
│  :6379   │     │  :3306   │     │ :8080/8443│
└──────────┘     └──────────┘     └───────────┘
      │                │                │
      └────────────────┴────────────────┘
                  app-network (bridge)`}</code></pre>

                        <h4>4.1 Redis (v7.2) — 缓存服务</h4>
                        <table>
                            <thead><tr><th>配置项</th><th>值</th></tr></thead>
                            <tbody>
                                <tr><td>最大内存</td><td>256 MB</td></tr>
                                <tr><td>淘汰策略</td><td><code>allkeys-lru</code></td></tr>
                                <tr><td>持久化方式</td><td>AOF (<code>appendfsync everysec</code>)</td></tr>
                                <tr><td>健康检查间隔</td><td>10s</td></tr>
                            </tbody>
                        </table>

                        <h4>4.2 MySQL (v8.0) — 核心数据库</h4>
                        <table>
                            <thead><tr><th>配置项</th><th>值</th></tr></thead>
                            <tbody>
                                <tr><td>字符集</td><td><code>utf8mb4_unicode_ci</code></td></tr>
                                <tr><td>表名大小写</td><td>不区分 (<code>lower-case-table-names=1</code>)</td></tr>
                                <tr><td>最大连接数</td><td>200</td></tr>
                                <tr><td>InnoDB 缓冲池</td><td>512 MB</td></tr>
                            </tbody>
                        </table>

                        <h4>4.3 Keycloak (v26.0.0) — 身份认证服务</h4>
                        <table>
                            <thead><tr><th>配置项</th><th>值</th></tr></thead>
                            <tbody>
                                <tr><td>运行模式</td><td><code>start</code>（生产模式）</td></tr>
                                <tr><td>缓存模式</td><td><code>local</code>（单节点）</td></tr>
                                <tr><td>数据库后端</td><td>同网络 MySQL 容器</td></tr>
                                <tr><td>HTTPS 证书</td><td><code>/certs/auth.example.com.*</code></td></tr>
                                <tr><td>访问路径前缀</td><td><code>/auth</code></td></tr>
                            </tbody>
                        </table>

                        <h3>5. 操作手册</h3>
                        <h4>5.1 首次部署</h4>
                        <pre><code>{`cd /opt/filixpay-deploy
# 确认 .env 和 certs/ 已准备就绪
docker-compose up -d
docker-compose ps`}</code></pre>

                        <h4>5.2 重启服务</h4>
                        <pre><code>{`docker-compose restart
docker-compose restart keycloak`}</code></pre>

                        <h4>5.3 停止与清理</h4>
                        <pre><code>{`docker-compose down --remove-orphans
# ⚠️ 慎用，会删除匿名卷
docker-compose down -v --remove-orphans`}</code></pre>

                        <h4>5.4 数据库连接</h4>
                        <pre><code>{`docker exec -it filixdb-prod-mysql mysql -uroot -p
docker exec -it filixdb-prod-redis redis-cli -a <REDIS_PASSWORD>`}</code></pre>

                        <h3>6. 注意事项</h3>
                        <ol>
                            <li><strong>Keycloak 管理员账号仅首次生效</strong>：相关凭证只会在空白数据库时创建 Admin 用户，后续修改 <code>.env</code> 不会生效。</li>
                            <li><strong>服务启动顺序</strong>：Keycloak 将自动等待 MySQL 健康检查通过后再启动，可能需要 1-2 分钟。</li>
                            <li><strong>HTTPS 证书必须存在</strong>：缺少对应证书文件将导致服务启动失败。</li>
                            <li><strong>MySQL 初始化脚本</strong>：需要为 Keycloak 预建数据库和用户，建议通过 init script 配置。</li>
                        </ol>

                    </article>
                </div>
            </section>
        </>
    );
}
