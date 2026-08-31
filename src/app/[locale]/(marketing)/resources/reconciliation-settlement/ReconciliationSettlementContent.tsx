import MarketingPage from '@/components/marketing/MarketingPage';
import styles from '@/components/marketing/marketing.module.css';

export default function ReconciliationSettlementContent() {
    return (
        <MarketingPage
            badge="Resources"
            heroTitle="FilixPay 对账与结算体系说明"
            heroDesc="资金安全与账务准确，是 FilixPay 的核心基础能力。通过灵活的结算机制与自动化对账工作流，平台可以完成从交易到账务结算的全链路闭环管理。"
            ctaTitle="构建清晰、可靠、可追踪的资金闭环"
            ctaDesc="FilixPay 支持多渠道统一对账、自动化账单获取、交易级精细核对、灵活结算控制、商户账务透明化与全链路资金追踪。"
            ctaButtonText="联系销售"
            ctaButtonHref="mailto:invest@filixpay.com"
        >
            <section className={styles.section}>
                <div className={styles.articleLayout}>
                    <p className={styles.articleIntro}>
                        为了兼顾业务处理效率与财务核算严谨性，FilixPay 提供了灵活的结算机制，以及完整的自动化对账工作流，帮助平台实现从交易到账务结算的全链路闭环管理。
                    </p>

                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>一</span>
                        <h2 className={styles.articleTitle}>灵活的资金结算机制</h2>
                        <p className={styles.articleText}>
                            FilixPay 支持为不同支付渠道配置独立的结算触发模式，以适配不同业务场景与风控要求。
                        </p>

                        <h3 className={styles.articleSubtitle}>1. 自动结算（Auto）</h3>
                        <p className={styles.articleText}>适用于以资金时效为优先目标的业务场景。</p>
                        <p className={styles.articleText}>
                            系统会根据渠道配置自动判断订单状态。当交易成功并安全度过设定的退款窗口期后，系统将自动进入结算流程，并将资金划入商户账户余额。
                        </p>
                        <ul className={styles.articleList}>
                            <li>无需人工干预</li>
                            <li>无需等待上游账单</li>
                            <li>提升商户资金周转效率</li>
                            <li>适合高频、低风险业务场景</li>
                        </ul>

                        <h3 className={styles.articleSubtitle}>2. 手动结算（Manual）</h3>
                        <p className={styles.articleText}>适用于以账务准确性与审计合规为核心要求的业务场景。</p>
                        <p className={styles.articleText}>
                            订单必须先完成“上游对账成功”，才允许进入结算流程。系统需要获取银行或第三方支付机构提供的官方账单，并与平台交易数据逐笔核对。只有在金额、状态等信息完全一致后，相关订单才会被纳入结算范围。
                        </p>
                        <ul className={styles.articleList}>
                            <li>账务数据可追溯</li>
                            <li>降低错账、漏账风险</li>
                            <li>满足财务审计与合规要求</li>
                            <li>适合大额、低容错业务场景</li>
                        </ul>
                    </article>

                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>二</span>
                        <h2 className={styles.articleTitle}>自动化优先的对账保障体系</h2>
                        <p className={styles.articleText}>
                            针对“手动结算”模式，FilixPay 提供完整的账单获取与异常兜底机制，保障每日对账工作的连续稳定。
                        </p>

                        <h3 className={styles.articleSubtitle}>1. 每日自动拉取上游账单</h3>
                        <p className={styles.articleText}>
                            系统内置稳定的定时对账任务。每天凌晨 1:00，系统会自动连接各支付渠道接口，拉取上一结算周期的官方交易账单，并自动归档至系统。
                        </p>
                        <p className={styles.articleText}>在绝大多数情况下，运营人员无需人工处理，次日即可直接开展对账工作。</p>
                        <ul className={styles.articleList}>
                            <li>自动下载渠道账单</li>
                            <li>自动归档保存</li>
                            <li>多渠道统一管理</li>
                            <li>支持重复下载与历史追溯</li>
                        </ul>

                        <h3 className={styles.articleSubtitle}>2. 人工兜底处理机制</h3>
                        <p className={styles.articleText}>
                            当遇到渠道接口维护、网络异常或账单延迟等特殊情况时，运营人员仍可通过后台手动完成账单处理。在营运中心【对账记录】页面，可使用“下载上游账单”实时向渠道重新发起账单下载请求，也可以使用“上传对账文件”，将从渠道后台手工下载的账单文件上传导入系统，确保对账流程不中断。
                        </p>
                    </article>

                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>三</span>
                        <h2 className={styles.articleTitle}>标准化对账与结算流程</h2>
                        <p className={styles.articleText}>
                            在营运中心的【对账记录】页面，可以完整查看一份账单从导入、核对到最终结算的全生命周期处理过程。
                        </p>

                        <h3 className={styles.articleSubtitle}>步骤一：解析文件</h3>
                        <p className={styles.articleText}>
                            当账单文件准备完成后，点击“解析文件”，系统会自动解析渠道账单，并将原始交易数据导入对账池。解析完成后，可通过“查看明细”查看底层原始渠道数据，包括交易流水号、订单号、金额、手续费、交易状态与交易时间。
                        </p>
                        <p className={styles.articleText}>系统不会修改或隐藏渠道原始数据，确保账务信息真实可追溯。</p>

                        <h3 className={styles.articleSubtitle}>步骤二：执行对账</h3>
                        <p className={styles.articleText}>
                            点击“执行对账”后，系统将自动使用对账引擎，对渠道账单与平台本地交易记录进行逐笔匹配。
                        </p>
                        <ul className={styles.articleList}>
                            <li>自动统计对账成功笔数、对账异常笔数、金额差异、状态差异与缺失订单</li>
                            <li>支持进一步查看异常明细，快速定位金额不一致、交易状态不一致、渠道存在但平台缺失、平台存在但渠道缺失、跨日到账、重复交易等问题</li>
                        </ul>

                        <h3 className={styles.articleSubtitle}>步骤三：执行结算</h3>
                        <p className={styles.articleText}>
                            确认对账结果无误后，运营人员即可执行结算。系统会将已通过对账校验的订单统一生成结算账单，并将对应资金划入商户账户余额。
                        </p>
                        <div className={styles.processLine}>交易 → 渠道账单 → 对账校验 → 结算入账</div>
                        <p className={styles.articleText}>
                            整个流程资金链路清晰可追踪，确保每一笔资金安全、准确到账。
                        </p>
                    </article>

                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>四</span>
                        <h2 className={styles.articleTitle}>完整的资金闭环管理能力</h2>
                        <p className={styles.articleText}>通过 FilixPay，您可以实现：</p>
                        <ul className={styles.articleList}>
                            <li>多渠道统一对账</li>
                            <li>自动化账单获取</li>
                            <li>交易级精细核对</li>
                            <li>灵活结算控制</li>
                            <li>商户账务透明化</li>
                            <li>全链路资金追踪</li>
                        </ul>
                        <p className={styles.articleText}>
                            无论是高频交易场景，还是高合规要求的金融业务，FilixPay 都能够为您提供稳定、安全、透明的资金管理能力。
                        </p>
                    </article>
                </div>
            </section>
        </MarketingPage>
    );
}
