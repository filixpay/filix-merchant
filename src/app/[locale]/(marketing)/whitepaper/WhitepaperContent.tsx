"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import styles from '@/components/marketing/marketing.module.css';

function LocalizedLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const locale = useLocale();
    const localizedHref = href === "/" ? `/${locale}` : `/${locale}${href}`;

    return <Link href={localizedHref}>{children}</Link>;
}

export default function WhitepaperContent() {
    return (
        <>
            <section className={styles.pageHero}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroBadge}>WHITEPAPER</div>
                    <h1 className={styles.heroTitle}>FilixPay 商户管控平台 · 系统白皮书</h1>
                    <p className={styles.heroSubtitle}>
                        让支付更简单，让生意更全球 — 全面了解 FilixPay 聚合支付平台的功能架构、业务模式与技术能力
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

                        {/* Keywords */}
                        <div className="keyword-bar">
                            {['跨境支付', '聚合支付平台', '四方支付', '三方代收代付', '加密货币收款', '信用额度管理', '多租户支付', '私有化部署', 'PCI-DSS', 'GDPR', 'Keycloak SSO'].map(tag => (
                                <span key={tag} className="keyword-tag">{tag}</span>
                            ))}
                        </div>

                        {/* Table of Contents */}
                        <div className="toc">
                            <h3>📖 目录</h3>
                            <ol>
                                <li><a href="#s1">平台定位与业务模式</a></li>
                                <li><a href="#s2">总览页</a></li>
                                <li><a href="#s3">收单管理</a></li>
                                <li><a href="#s4">资金管理</a></li>
                                <li><a href="#s5">信用风控管理</a></li>
                                <li><a href="#s6">我的信用</a></li>
                                <li><a href="#s7">订单管理</a></li>
                                <li><a href="#s8">退款管理</a></li>
                                <li><a href="#s9">客户管理</a></li>
                                <li><a href="#s10">线下收款</a></li>
                                <li><a href="#s11">代发管理</a></li>
                                <li><a href="#s12">安全设置 / 服务计划 / 开发者中心</a></li>
                                <li><a href="#s13">支付通道与集成能力</a></li>
                                <li><a href="#s14">技术架构与安全合规</a></li>
                                <li><a href="#s15">私有化部署方案</a></li>
                            </ol>
                        </div>

                        {/* Section 1 */}
                        <h2 id="s1">一、平台定位与业务模式</h2>
                        <p>
                            <LocalizedLink href="/">FilixPay</LocalizedLink> 是一套专为跨境出海企业与平台型商户打造的<strong>四方聚合支付技术服务平台</strong>。系统提供两种核心结算架构，商户<LocalizedLink href="/login">登录</LocalizedLink>后即自动匹配对应功能视图：
                        </p>
                        <table>
                            <thead><tr><th>模式</th><th>结算架构</th><th>资金流向</th><th>适用对象</th></tr></thead>
                            <tbody>
                                <tr><td><strong><LocalizedLink href="/solutions/cross-border-ecommerce">独立商户（四方模式）</LocalizedLink></strong></td><td>银行直清</td><td>资金由持牌收单机构直达商户银行账户</td><td>独立品牌商、DTC 卖家</td></tr>
                                <tr><td><strong><LocalizedLink href="/solutions/group-enterprise">子商户（三方模式）</LocalizedLink></strong></td><td>平台代收代付</td><td>资金汇入平台统一账户，支持<strong>按订单实时结算</strong>（过了退款期即触发）或按约定周期结算</td><td>集团子公司、SaaS 入驻商户</td></tr>
                            </tbody>
                        </table>
                        <p>系统原生支持 <LocalizedLink href="/technology/identity">OIDC / SAML 协议的统一身份认证</LocalizedLink>，基于 Keycloak 提供 SSO 单点登录与细粒度 RBAC 权限控制。</p>
                        <blockquote>💡 更多业务模式详情请参阅 <LocalizedLink href="/products">产品总览</LocalizedLink> 与 <LocalizedLink href="/solutions">解决方案中心</LocalizedLink>。</blockquote>

                        <hr />

                        {/* Section 2 */}
                        <h2 id="s2">二、总览页（Dashboard Overview）</h2>
                        <p>实时业务经营仪表盘，商户<LocalizedLink href="/dashboard">登录后</LocalizedLink>的第一视图。</p>
                        <ul>
                            <li><strong>经营指标</strong>：今日总收入、今日总订单数、活跃支付渠道数</li>
                            <li><strong>资金快照</strong>：可用余额、冻结金额、总余额</li>
                            <li><strong>近期交易流</strong>：按时间倒序展示最新交易动态</li>
                        </ul>

                        <hr />

                        {/* Section 3 */}
                        <h2 id="s3">三、收单管理（Acquiring Management）</h2>
                        <blockquote>仅在四方直清模式或平台商户身份下展示</blockquote>

                        <h3>3.1 <LocalizedLink href="/dashboard/sub-merchants">子商户（Sub-Merchants）</LocalizedLink></h3>
                        <p>建立内部结算层级体系。每个子商户代表一个独立的收款实体，拥有唯一的商户代码。</p>
                        <blockquote>🏢 面向集团企业的「阳光收单」体系详见 <LocalizedLink href="/solutions/group-enterprise">企业集团解决方案</LocalizedLink>。</blockquote>

                        <h3>3.2 <LocalizedLink href="/dashboard/locations">门店（Locations）</LocalizedLink></h3>
                        <ul>
                            <li><strong>基础信息</strong>：名称、地址、国家/地区、联系手机、邮箱、服务电话</li>
                            <li><strong>防伪收款码</strong>：系统为每家门店生成独立二维码 + 唯一<strong>防伪验证码（Anti-Fraud Code）</strong>，有效杜绝替换欺诈。支持一键下载。</li>
                        </ul>

                        <h3>3.3 <LocalizedLink href="/dashboard/configs">支付配置（Payment Configs）</LocalizedLink></h3>
                        <p>管理<strong>支付品牌 → 支付渠道 → 支付场景</strong>的完整通道映射。</p>

                        <h3>3.4 <LocalizedLink href="/dashboard/checkouts">收银台配置（Checkout Counters）</LocalizedLink></h3>
                        <ul>
                            <li><strong>标签页体系</strong>：创建多标签页，自定义排列顺序与启用状态</li>
                            <li><strong>网关挂载</strong>：配置 Logo、品牌颜色、支持货币（如 <code>USD,EUR,*</code>）、地区限制</li>
                            <li><strong>独立部署</strong>：收银台可部署至自有域名（<a href="https://github.com/filixpay/filix-checkout" target="_blank" rel="noopener noreferrer">GitHub 开源示例</a>）</li>
                        </ul>

                        <h3>3.5 分账管理（Split Payments）</h3>
                        <p>为平台型商户提供灵活的资金二次分配能力，支持在交易发生时或延迟结算时将资金自动划拨至多个关联方账户。</p>
                        <ul>
                            <li><strong>三类分账模式</strong>：
                                <ul>
                                    <li><strong>固定分账 (Fixed)</strong>：按固定金额（如每笔订单抽成 5.00 USD）执行。</li>
                                    <li><strong>按比例分账 (Percentage)</strong>：按订单总额的百分比（如 10%）执行。</li>
                                    <li><strong>延迟分账 (Deferred)</strong>：支持设置等待期（如 T+7 后触发），适用于担保交易或售后维权期。</li>
                                </ul>
                            </li>
                            <li><strong>自定义接收方</strong>：灵活配置供应方（Supplier）、媒介商（Agent）、服务商（Service Provider）等不同角色的结算路径。</li>
                            <li><strong>开发者接入</strong>：在 API <code>createOrder</code> 中通过 <code>paymentSplitConfig</code> 对象实现动态配置。</li>
                        </ul>

                        <hr />

                        {/* Section 4 */}
                        <h2 id="s4">四、资金管理（Funds Management）</h2>
                        <blockquote>仅在平台结算模式下展示</blockquote>

                        <h3>4.1 <LocalizedLink href="/dashboard/money/balance">账户余额</LocalizedLink></h3>
                        <p>可用余额 / 冻结金额 / 总余额三维视图。收支明细表含交易时间、业务类型、变动金额、变动前后余额、关联业务单号（<code>businessId</code>）。</p>

                        <h3>4.2 <LocalizedLink href="/dashboard/money/money-in">资金入账</LocalizedLink></h3>
                        <p>查看充值历史，支持一键发起充值指令。</p>

                        <h3>4.3 <LocalizedLink href="/dashboard/money/payouts">出金记录</LocalizedLink></h3>
                        <ul>
                            <li><strong>收款账户联动</strong>：自动加载已配置的<LocalizedLink href="/dashboard/money/external-accounts">外部银行账户</LocalizedLink>（须显式选择，无主账户兜底）</li>
                            <li><strong>余额上限校验</strong>：提现金额不得超过可用余额</li>
                            <li><strong>交易密码保护</strong>：须输入 6 位数字<LocalizedLink href="/dashboard/security-settings/transaction-password">交易密码</LocalizedLink></li>
                        </ul>

                        <h3>4.4 <LocalizedLink href="/dashboard/money/transfers">转账记录</LocalizedLink> / <LocalizedLink href="/dashboard/money/payouts">出金记录</LocalizedLink></h3>
                        <p>内部转账支持批量添加收款方，代付记录追踪每笔代付明细。</p>

                        <h3>4.5 实时订单结算（Instant Order-level Settlement）</h3>
                        <p>系统独有的高频结算机制，打破传统 T+N 或每日结算的限制：</p>
                        <ul>
                            <li><strong>按订单级驱动</strong>：每笔订单独立结算，不依赖每日或每周的批处理流程。</li>
                            <li><strong>自动触发机制</strong>：订单退款截止日期由商户下单时传入（如果不传，系统默认设定为支付成功后 +7 天）。一旦期限届满，系统立即自动执行结算指令。</li>
                            <li><strong>资金极速到账</strong>：结算完成后资金即刻从“冻结”转为“可用”，商户可立即发起提现或内部转账，极大提升资金周转率。</li>
                        </ul>

                        <hr />

                        {/* Section 5 */}
                        <h2 id="s5">五、信用风控管理（Credit Risk Management）</h2>
                        <p>平台级商户的授信与风控枢纽。更多信息请参阅 <LocalizedLink href="/products/credit-payment">信用支付产品页</LocalizedLink>。</p>

                        <h3>5.1 <LocalizedLink href="/dashboard/credit/limit">信用额度管理</LocalizedLink></h3>
                        <table>
                            <thead><tr><th>条款类型</th><th>说明</th></tr></thead>
                            <tbody>
                                <tr><td><code>IMMEDIATE</code></td><td>即时付款</td></tr>
                                <tr><td><code>NET_DAYS</code></td><td>固定天数账期</td></tr>
                                <tr><td><code>END_OF_MONTH</code></td><td>月末结清</td></tr>
                                <tr><td><code>ON_DELIVERY</code></td><td>货到付款</td></tr>
                                <tr><td><code>STAGE_BASED</code></td><td>按阶段付款</td></tr>
                            </tbody>
                        </table>

                        <h3>5.2 <LocalizedLink href="/dashboard/credit/limit">额度调整记录</LocalizedLink></h3>
                        <p>完整记录操作人、调整前/后额度、调整金额及时间戳。</p>

                        <h3>5.3 <LocalizedLink href="/dashboard/credit/limit">信用交易流水</LocalizedLink></h3>
                        <table>
                            <thead><tr><th>交易类型</th><th>说明</th></tr></thead>
                            <tbody>
                                <tr><td><strong>USE</strong></td><td>额度使用</td></tr>
                                <tr><td><strong>REPAY</strong></td><td>信用还款</td></tr>
                                <tr><td><strong>ADJUST</strong></td><td>额度调整</td></tr>
                                <tr><td><strong>REFUND</strong></td><td>退款返还</td></tr>
                            </tbody>
                        </table>

                        <hr />

                        {/* Section 6 */}
                        <h2 id="s6">六、我的信用（My Credit）</h2>
                        <ul>
                            <li><LocalizedLink href="/dashboard/member-credit/available-credit"><strong>可用额度</strong></LocalizedLink>：查看各授信方分配的总额度、已用额度、剩余可用</li>
                            <li><LocalizedLink href="/dashboard/member-credit/available-credit"><strong>额度变动记录</strong></LocalizedLink>：历次调整的变动前后对比（额度详情抽屉）</li>
                            <li><LocalizedLink href="/dashboard/member-credit/available-credit"><strong>信用支付记录</strong></LocalizedLink>：信用额度完成的支付/退款/还款明细（额度详情抽屉）</li>
                        </ul>

                        <hr />

                        {/* Section 7 */}
                        <h2 id="s7">七、<LocalizedLink href="/dashboard/orders">订单管理（Orders）</LocalizedLink></h2>
                        <p>交易流水的核心监控引擎。列表含商户订单号、交易流水号、子商户/门店、金额（绿色标识）、状态（SUCCESS = 绿色徽章）。</p>
                        <table>
                            <thead><tr><th>操作</th><th>触发条件</th><th>功能描述</th></tr></thead>
                            <tbody>
                                <tr><td><strong>发起收款</strong></td><td>状态 = PENDING</td><td>生成支付令牌，跳转收银台</td></tr>
                                <tr><td><strong>发起退款</strong></td><td>SUCCESS + 有可退金额</td><td>全额/部分退款，自动计算可退余额</td></tr>
                                <tr><td><strong>掉单处理</strong></td><td>状态 ≠ SUCCESS</td><td>向上游补查交易状态</td></tr>
                                <tr><td><strong>补单（Patch）</strong></td><td>dealType = PATCH</td><td>一键同步本地与上游状态</td></tr>
                            </tbody>
                        </table>

                        <hr />

                        {/* Section 8 */}
                        <h2 id="s8">八、<LocalizedLink href="/dashboard/refunds">退款管理（Refunds）</LocalizedLink></h2>
                        <p>独立的退款生命周期追踪。包含退款流水号、退款金额、商户实际退款、退还服务费、退款原因及原订单信息。</p>

                        <hr />

                        {/* Section 9 */}
                        <h2 id="s9">九、<LocalizedLink href="/dashboard/customers">客户管理（Customers）</LocalizedLink></h2>
                        <p>跨渠道客户画像管理。支持按姓名、客户号、邮箱、手机号、状态等维度检索。</p>

                        <hr />

                        {/* Section 10 */}
                        <h2 id="s10">十、线下收款（Offline Collection）</h2>
                        <p>面向 B2B 银行转账场景的闭环处理中枢，实现<strong>三级审签制度</strong>：</p>

                        <h3>10.1 <LocalizedLink href="/dashboard/money/external-accounts">银行账户（ExternalAccount）</LocalizedLink></h3>
                        <p>统一管理商户银行账户身份（国家、币种、开户名、银行名、账号掩码）。下单线下收款须显式选择账户，不再使用主账户兜底。</p>

                        <h3>10.2 <LocalizedLink href="/dashboard/transfers">凭证审核（第一道审核）</LocalizedLink></h3>
                        <p>审核打款凭证（支持放大查看），录入银行交易流水号与付款人信息。三状态流转：待审批 → 通过 / 拒绝。</p>

                        <h3>10.3 <LocalizedLink href="/dashboard/reviews">入账确认（第二道复核）</LocalizedLink></h3>
                        <p>由独立复核人（Review Operator）执行，与审批人相互制衡。确认入账后资金正式计入余额。</p>

                        <hr />

                        {/* Section 11 */}
                        <h2 id="s11">十一、代发管理（Payout Management）</h2>
                        <blockquote>仅向平台商户开放</blockquote>
                        <ul>
                            <li><LocalizedLink href="/dashboard/money/payouts"><strong>出金管理</strong></LocalizedLink>：查看与处理出金申请、状态与收款账户</li>
                        </ul>

                        <hr />

                        {/* Section 12 */}
                        <h2 id="s12">十二、系统设置与开发者</h2>

                        <h3><LocalizedLink href="/dashboard/security-settings/transaction-password">交易密码</LocalizedLink></h3>
                        <p>邮箱验证码身份验证 → 设置 6 位数字密码（含强度检测） → 完成。</p>

                        <h3><LocalizedLink href="/dashboard/service-plan">服务计划</LocalizedLink></h3>
                        <table>
                            <thead><tr><th>方案</th><th>价格</th><th>定位</th></tr></thead>
                            <tbody>
                                <tr><td>周付</td><td>50 USD/周</td><td>轻松体验</td></tr>
                                <tr><td>月付</td><td>200 USD/月</td><td>日常运营</td></tr>
                                <tr><td>半年</td><td>1,100 USD/半年</td><td>性价比之选</td></tr>
                                <tr><td>年付</td><td>2,000 USD/年</td><td>省心更省钱</td></tr>
                            </tbody>
                        </table>

                        <h3><LocalizedLink href="/dashboard/developer">开发者中心</LocalizedLink></h3>
                        <ul>
                            <li><strong>API 凭证管理</strong>：配合 <a href="/openapi/v1/swagger" target="_blank" rel="noopener noreferrer">Swagger 文档</a> 实现快速接入</li>
                            <li><strong>Webhook 端点管理</strong>：配置回调 URL，支持<LocalizedLink href="/dashboard/developer/webhook-verification">签名验证</LocalizedLink></li>
                            <li><strong>Webhook 投递审计</strong>：完整记录每次发送的报文、投递状态与尝试次数</li>
                        </ul>

                        <hr />

                        {/* Section 13 */}
                        <h2 id="s13">十三、支付通道与集成能力</h2>
                        <table>
                            <thead><tr><th>类别</th><th>渠道</th><th>了解更多</th></tr></thead>
                            <tbody>
                                <tr><td>信用卡/借记卡</td><td>Stripe</td><td><LocalizedLink href="/products">聚合支付</LocalizedLink></td></tr>
                                <tr><td>数字钱包</td><td>Alipay+、WeChat Pay、PayPal</td><td><LocalizedLink href="/solutions/cross-border-ecommerce">跨境电商</LocalizedLink></td></tr>
                                <tr><td>加密货币</td><td>NowPayments、Coinbase、OKX Pay</td><td><LocalizedLink href="/products/crypto-payment">加密货币支付</LocalizedLink></td></tr>
                                <tr><td>线下转账</td><td>凭证审核 + 双人双签</td><td><LocalizedLink href="/dashboard/transfers">凭证审核</LocalizedLink></td></tr>
                            </tbody>
                        </table>
                        <p><strong>集成方式</strong>：收银台独立部署（<a href="https://github.com/filixpay/filix-checkout" target="_blank" rel="noopener noreferrer">GitHub</a> · <LocalizedLink href="/resources/case-studies">客户实例</LocalizedLink>）/ 嵌入式 SDK / <LocalizedLink href="/dashboard/developer">API 直连</LocalizedLink></p>

                        <hr />

                        {/* Section 14 */}
                        <h2 id="s14">十四、技术架构与安全合规</h2>
                        <ul>
                            <li><LocalizedLink href="/technology/architecture"><strong>微服务架构</strong></LocalizedLink>：Kubernetes 事件驱动，99.99% 可用性</li>
                            <li><LocalizedLink href="/technology/identity"><strong>身份认证</strong></LocalizedLink>：Keycloak，OIDC / MFA / WebAuthn(FIDO2)，FAPI 700+ 项测试</li>
                            <li><LocalizedLink href="/technology/blockchain"><strong>区块链集成</strong></LocalizedLink>：多链适配，跨链互信与合规审计</li>
                            <li><LocalizedLink href="/resources/compliance"><strong>合规就绪</strong></LocalizedLink>：GDPR、PCI-DSS、FATF 旅行规则、等保三级</li>
                        </ul>

                        <hr />

                        {/* Section 15 */}
                        <h2 id="s15">十五、私有化部署方案</h2>
                        <ul>
                            <li><strong>极简部署</strong>：4 核 8G 服务器，<code>docker-compose up</code>，30 分钟完成</li>
                            <li><strong>数据主权</strong>：100% 私有存储，满足各地合规</li>
                            <li><strong>费用</strong>：28,000 USD 含一年技术维护</li>
                            <li><strong>资源</strong>：<LocalizedLink href="/resources/downloads">下载中心</LocalizedLink>（部署指南 · 授权协议 · <a href="/openapi/v1/swagger" target="_blank" rel="noopener noreferrer">API 规范</a>）</li>
                        </ul>

                        <hr />

                        <h2>联系我们</h2>
                        <p>
                            🌐 官网：<LocalizedLink href="/">filixpay.com</LocalizedLink><br />
                            📧 商务合作：<a href="mailto:invest@filixpay.com">invest@filixpay.com</a><br />
                            📖 技术博客：<LocalizedLink href="/resources/blog">FilixPay Blog</LocalizedLink><br />
                            💻 开源项目：<a href="https://github.com/filixpay/filix-checkout" target="_blank" rel="noopener noreferrer">GitHub</a>
                        </p>
                        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 48, fontSize: 14 }}>
                            © 2026 FilixPay (Filix.com) · 保留所有权利
                        </p>
                    </article>
                </div>
            </section>
        </>
    );
}
