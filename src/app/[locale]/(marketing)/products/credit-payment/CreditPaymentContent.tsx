"use client";

import Link from 'next/link';
import { useLocale } from 'next-intl';
import styles from '@/components/marketing/marketing.module.css';

/* ── SVG Icon Components ── */
const SvgShield = ({ color = '#3b82f6', size = 24 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const SvgCreditCard = ({ color = '#3b82f6', size = 24 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const SvgFileText = ({ color = '#3b82f6', size = 24 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
);

const SvgScale = ({ color = '#3b82f6', size = 24 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3 8 3" /><path d="M12 3v18" /><path d="m19 8-3.5-5" /><path d="m5 8 3.5-5" />
        <path d="M3 12a6 6 0 0 0 4.24-1.76L5 8" /><circle cx="5" cy="14" r="2" /><path d="M21 12a6 6 0 0 1-4.24-1.76L19 8" /><circle cx="19" cy="14" r="2" />
    </svg>
);

const SvgSearch = ({ color = '#3b82f6', size = 24 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const SvgBarChart = ({ color = '#10b981', size = 24 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);

const SvgZap = ({ color = '#10b981', size = 24 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const SvgClipboard = ({ color = '#10b981', size = 24 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="m9 14 2 2 4-4" />
    </svg>
);

const SvgCart = ({ color = '#ffffff', size = 28 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const SvgLock = ({ color = '#ffffff', size = 28 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const SvgDollar = ({ color = '#ffffff', size = 28 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const SvgCheckCircle = ({ color = '#ffffff', size = 28 }: { color?: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const SvgArrowRight = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

/* ── Account Terms Table ── */
const TERMS = [
    { code: 'IMMEDIATE', label: '即时付款', desc: '无账期，下单同步全额清算' },
    { code: 'NET_DAYS', label: '固定天数账期', desc: '如 Net 30、Net 60，按自然日自动催收' },
    { code: 'END_OF_MONTH', label: '月末结清', desc: '按自然月归集，月底生成统一应付账单' },
    { code: 'ON_DELIVERY', label: '货到付款', desc: '物流签收后触发结算，适用于 O2O 大宗' },
    { code: 'STAGE_BASED', label: '里程碑付款', desc: '项目制交付，按验收阶段逐期释放额度' },
];

/* ── Main Page ── */
export default function CreditPaymentContent() {
    const locale = useLocale();

    return (
        <>
            {/* ───── Hero ───── */}
            <section className={styles.pageHero}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroBadge}>B2B CREDIT FINANCING</div>
                    <h1 className={styles.heroTitle}>B2B 信用支付与供应链风控</h1>
                    <p className={styles.heroSubtitle}>
                        为平台级生态量身打造的「先买后付」双闭环系统 — 授信方拥有严谨的风控抓手，下游商户享受秒级结账的无缝交易体验。
                    </p>
                    <div className={styles.heroActions}>
                        <Link href={`/${locale}/login`} className={styles.btnPrimary}>立即体验</Link>
                        <a href="mailto:invest@filixpay.com" className={styles.btnSecondary}>联系销售</a>
                    </div>
                </div>
            </section>

            {/* ───── Dual System ───── */}
            <section className={styles.section}>
                <style jsx>{`
                    .cp-dual { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
                    .cp-card {
                        background: #fff; border-radius: 20px; padding: 44px 36px;
                        border: 1px solid #e2e8f0; position: relative; overflow: hidden;
                        transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s cubic-bezier(.4,0,.2,1);
                    }
                    .cp-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -12px rgba(0,0,0,.08); border-color: transparent; }
                    .cp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; }
                    .cp-card.blue::before { background: linear-gradient(90deg,#3b82f6,#6366f1); }
                    .cp-card.green::before { background: linear-gradient(90deg,#10b981,#06b6d4); }
                    .cp-head { display:flex; align-items:center; gap:20px; margin-bottom:36px; }
                    .cp-head-icon { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                    .cp-head-icon.blue { background: linear-gradient(135deg,#eff6ff,#dbeafe); }
                    .cp-head-icon.green { background: linear-gradient(135deg,#ecfdf5,#d1fae5); }
                    .cp-head h2 { font-size:22px; font-weight:800; color:#0f172a; margin:0; }
                    .cp-head p { color:#64748b; margin:4px 0 0; font-size:14px; font-weight:500; }
                    .cp-list { list-style:none; padding:0; margin:0; }
                    .cp-list li { display:flex; gap:16px; margin-bottom:28px; align-items:flex-start; }
                    .cp-list li:last-child { margin-bottom:0; }
                    .cp-li-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                    .cp-li-icon.blue { background:#eff6ff; }
                    .cp-li-icon.green { background:#ecfdf5; }
                    .cp-li-title { margin:0 0 4px; font-size:16px; font-weight:700; color:#1e293b; }
                    .cp-li-desc { margin:0; font-size:14.5px; line-height:1.65; color:#64748b; }
                    @media(max-width:768px) {
                        .cp-dual { grid-template-columns:1fr; }
                    }
                `}</style>

                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>双角色互锁的信用金融体系</h2>
                        <p className={styles.sectionSubtitle}>
                            一套系统，两种视角。授信方做「风控官」，用信方做「采购员」，基于 OIDC RBAC 权限天然隔离数据，互不干扰又相互制衡。
                        </p>
                    </div>

                    <div className="cp-dual">
                        {/* Left: 授信方 */}
                        <div className="cp-card blue">
                            <div className="cp-head">
                                <div className="cp-head-icon blue"><SvgShield color="#3b82f6" size={28} /></div>
                                <div>
                                    <h2>信用与风控体系</h2>
                                    <p>平台方 / 授信方控制中枢</p>
                                </div>
                            </div>
                            <ul className="cp-list">
                                <li>
                                    <div className="cp-li-icon blue"><SvgFileText color="#3b82f6" size={22} /></div>
                                    <div>
                                        <h4 className="cp-li-title">信用额度与账期分配</h4>
                                        <p className="cp-li-desc">不仅设定最高可透支额度，更支持灵活设定账单日与条款（月末结清、固定天数账期、货到付款等），实现千人千面的授信策略。</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="cp-li-icon blue"><SvgScale color="#3b82f6" size={22} /></div>
                                    <div>
                                        <h4 className="cp-li-title">多维调整与合规审计</h4>
                                        <p className="cp-li-desc">风控人员可根据历史还款表现进行额度的临时上调或收缩，系统底层保留全量防篡改审计日志，合规无死角。</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="cp-li-icon blue"><SvgSearch color="#3b82f6" size={22} /></div>
                                    <div>
                                        <h4 className="cp-li-title">全局流水监控台</h4>
                                        <p className="cp-li-desc">拥有上帝视角，实时掌控每一个子商户的额度使用 (USE)、还款 (REPAY) 与退款撤销 (REFUND) 并发动态。</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Right: 用信方 */}
                        <div className="cp-card green">
                            <div className="cp-head">
                                <div className="cp-head-icon green"><SvgCreditCard color="#10b981" size={28} /></div>
                                <div>
                                    <h2>我的信用账单</h2>
                                    <p>下游采购方 / 子商户视图</p>
                                </div>
                            </div>
                            <ul className="cp-list">
                                <li>
                                    <div className="cp-li-icon green"><SvgBarChart color="#10b981" size={22} /></div>
                                    <div>
                                        <h4 className="cp-li-title">可用额度实时洞察</h4>
                                        <p className="cp-li-desc">商户操作台专属对账仪表盘，清晰展示总获批额度、当前在途冻结额度及剩余购买力，批量下单前心中有数。</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="cp-li-icon green"><SvgZap color="#10b981" size={22} /></div>
                                    <div>
                                        <h4 className="cp-li-title">收银台极速结账</h4>
                                        <p className="cp-li-desc">告别线下打款凭证审核。在商城收银台点选「信用支付」，一键完成担保划扣，订单极速进入发货流程。</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="cp-li-icon green"><SvgClipboard color="#10b981" size={22} /></div>
                                    <div>
                                        <h4 className="cp-li-title">交易级财务对账</h4>
                                        <p className="cp-li-desc">独立隔离的视图确保只追踪自身数据，自动关联销售单与退货单，退货自动释放信用额度，对账零误差。</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── Settlement Terms ───── */}
            <section className={styles.sectionAlt}>
                <style jsx>{`
                    .terms-table { width:100%; border-collapse:collapse; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.04); }
                    .terms-table th { background:#0f172a; color:#e2e8f0; font-size:14px; font-weight:700; text-align:left; padding:16px 24px; letter-spacing:.02em; }
                    .terms-table td { padding:16px 24px; font-size:14.5px; color:#334155; border-bottom:1px solid #f1f5f9; vertical-align:top; }
                    .terms-table tr:last-child td { border-bottom:none; }
                    .terms-table tr:hover td { background:#f8fafc; }
                    .terms-code { display:inline-block; background:#eff6ff; color:#2563eb; padding:3px 10px; border-radius:6px; font-size:13px; font-weight:600; font-family:var(--font-mono); }
                `}</style>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>灵活的结算条款引擎</h2>
                        <p className={styles.sectionSubtitle}>
                            五种结算条款类型覆盖 B2B 供应链全场景，可按商户维度独立配置，系统到期自动触发催收与状态结转。
                        </p>
                    </div>
                    <table className="terms-table">
                        <thead>
                            <tr><th style={{ width: '180px' }}>条款代码</th><th style={{ width: '140px' }}>名称</th><th>适用说明</th></tr>
                        </thead>
                        <tbody>
                            {TERMS.map(t => (
                                <tr key={t.code}>
                                    <td><span className="terms-code">{t.code}</span></td>
                                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{t.label}</td>
                                    <td>{t.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ───── Workflow ───── */}
            <section style={{ padding: '100px 0', background: 'linear-gradient(180deg,#0f172a 0%,#1e293b 100%)', position: 'relative', overflow: 'hidden' }}>
                {/* subtle background grid pattern */}
                <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }} />

                <style jsx>{`
                    .wf-grid { display:flex; align-items:center; justify-content:center; gap:0; }
                    .wf-step { text-align:center; flex:1; max-width:220px; }
                    .wf-icon-wrap { width:72px; height:72px; border-radius:20px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
                    .wf-step h4 { color:#f8fafc; margin:0 0 8px; font-size:16px; font-weight:700; }
                    .wf-step p { color:#94a3b8; font-size:14px; margin:0; line-height:1.55; padding:0 8px; }
                    .wf-arrow { flex-shrink:0; padding:0 8px; }
                    @media(max-width:768px) {
                        .wf-grid { flex-direction:column; gap:32px; }
                        .wf-arrow { transform:rotate(90deg); }
                    }
                `}</style>

                <div className={styles.sectionContainer} style={{ position:'relative', zIndex:1 }}>
                    <div style={{ textAlign:'center', marginBottom:'64px' }}>
                        <h2 style={{ color:'#fff', fontSize:'40px', fontWeight:800, margin:'0 0 20px', letterSpacing:'-0.02em' }}>
                            订单级精准追踪，严密的风控闭环
                        </h2>
                        <p style={{ color:'#94a3b8', fontSize:'18px', maxWidth:'680px', margin:'0 auto', lineHeight:1.6 }}>
                            每一分信用额度都与实际商业订单绑定，系统状态机自动执行额度的扣减、对账与释放，构建零人工干预的自动化供应链金融底座。
                        </p>
                    </div>

                    <div className="wf-grid">
                        <div className="wf-step">
                            <div className="wf-icon-wrap" style={{ background:'rgba(59,130,246,.15)' }}><SvgCart /></div>
                            <h4>1. 触发交易</h4>
                            <p>子商户在平台商城发起大宗采购订单</p>
                        </div>
                        <div className="wf-arrow"><SvgArrowRight /></div>
                        <div className="wf-step">
                            <div className="wf-icon-wrap" style={{ background:'rgba(245,158,11,.15)' }}><SvgLock color="#f59e0b" /></div>
                            <h4>2. 风控校验 (USE)</h4>
                            <p>匹配授信策略，实时暂扣可用额度并入账</p>
                        </div>
                        <div className="wf-arrow"><SvgArrowRight /></div>
                        <div className="wf-step">
                            <div className="wf-icon-wrap" style={{ background:'rgba(16,185,129,.15)' }}><SvgDollar color="#10b981" /></div>
                            <h4>3. 账期结算 (REPAY)</h4>
                            <p>系统依据设定的结算条款自动触发催收还款</p>
                        </div>
                        <div className="wf-arrow"><SvgArrowRight /></div>
                        <div className="wf-step">
                            <div className="wf-icon-wrap" style={{ background:'rgba(99,102,241,.15)' }}><SvgCheckCircle color="#818cf8" /></div>
                            <h4>4. 额度恢复</h4>
                            <p>还款完成后秒级释放额度，开启新一轮周转</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── CTA ───── */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContainer}>
                    <h2 className={styles.ctaTitle}>开启您的 B2B 信用支付之旅</h2>
                    <p className={styles.ctaDesc}>
                        从手工赊销到系统化授信管控，FilixPay 助力平台企业实现供应链金融的数字化跃迁。
                    </p>
                    <Link href={`/${locale}/login`} className={styles.btnPrimary}>免费注册</Link>
                </div>
            </section>
        </>
    );
}
