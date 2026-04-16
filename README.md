# [FilixPay](https://www.filixpay.com) 商户管控平台 · 系统白皮书

让支付更简单，让生意更全球 — 全面了解 [FilixPay](https://www.filixpay.com) 聚合支付平台的功能架构、业务模式与技术能力

---

## 🏷️ 核心关键词
`跨境支付` `聚合支付平台` `四方支付` `三方代收代付` `加密货币收款` `信用额度管理` `多租户支付` `私有化部署` `PCI-DSS` `GDPR` `Keycloak SSO`

---

## 📖 目录
1. [一、平台定位与业务模式](#s1)
2. [二、总览页（Dashboard Overview）](#s2)
3. [三、收单管理（Acquiring Management）](#s3)
4. [四、资金管理（Funds Management）](#s4)
5. [五、信用风控管理（Credit Risk Management）](#s5)
6. [六、我的信用（My Credit）](#s6)
7. [七、订单管理（Orders）](#s7)
8. [八、退款管理（Refunds）](#s8)
9. [九、客户管理（Customers）](#s9)
10. [十、线下收款（Offline Collection）](#s10)
11. [十一、代发管理（Payout Management）](#s11)
12. [十二、安全设置 / 服务计划 / 开发者中心](#s12)
13. [十三、支付通道与集成能力](#s13)
14. [十四、技术架构与安全合规](#s14)
15. [十五、私有化部署方案](#s15)

---

<h2 id="s1">一、平台定位与业务模式</h2>

[FilixPay](https://www.filixpay.com) 是一套专为跨境出海企业与平台型商户打造的**四方聚合支付技术服务平台**。系统提供两种核心结算架构：

| 模式 | 结算架构 | 资金流向 | 适用对象 |
| :--- | :--- | :--- | :--- |
| **独立商户（四方模式）** | 银行直清 | 资金由持牌收单机构直达商户银行账户 | 独立品牌商、DTC 卖家 |
| **子商户（三方模式）** | 平台代收代付 | 资金汇入平台统一账户，按约定周期结算 | 集团子公司、SaaS 入驻商户 |

系统原生支持 [OIDC / SAML 协议的统一身份认证](https://www.filixpay.com/technology/identity)，基于 Keycloak 提供 SSO 单点登录与细粒度 RBAC 权限控制。

> 💡 更多业务模式详情请参阅 [产品总览](https://www.filixpay.com/products) 与 [解决方案中心](https://www.filixpay.com/solutions)。

---

<h2 id="s2">二、总览页（Dashboard Overview）</h2>

实时业务经营仪表盘，商户登录后的第一视图。

- **经营指标**：今日总收入、今日总订单数、活跃支付渠道数
- **资金快照**：可用余额、冻结金额、总余额
- **近期交易流**：按时间倒序展示最新交易动态

---

<h2 id="s3">三、收单管理（Acquiring Management）</h2>

> 仅在四方直清模式或平台商户身份下展示

### 3.1 子商户（Sub-Merchants）
建立内部结算层级体系。每个子商户代表一个独立的收款实体，拥有唯一的商户代码。

> 🏢 面向集团企业的"阳光收单"体系详见 [企业集团解决方案](https://www.filixpay.com/solutions/group-enterprise)。

### 3.2 门店（Locations）
- **基础信息**：名称、地址、国家/地区、联系手机、邮箱、服务电话
- **防伪收款码**：系统为每家门店生成独立二维码 + 唯一**防伪验证码（Anti-Fraud Code）**，有效杜绝替换欺诈。支持一键下载。

### 3.3 支付配置（Payment Configs）
管理**支付品牌 → 支付渠道 → 支付场景**的完整通道映射。

### 3.4 收银台配置（Checkout Counters）
- **标签页体系**：创建多标签页，自定义排列顺序与启用状态
- **网关挂载**：配置 Logo、品牌颜色、支持货币（如 `USD,EUR,*`）、地区限制
- **独立部署**：收银台可部署至自有域名（[GitHub 开源示例](https://github.com/filixpay/filix-checkout)）

---

<h2 id="s4">四、资金管理（Funds Management）</h2>

> 仅在三方模式（THREE_PARTY 结算模式）下展示

### 4.1 账户余额
可用余额 / 冻结金额 / 总余额三维视图。收支明细表含交易时间、业务类型、变动金额、变动前后余额、关联业务单号（`businessId`）。

### 4.2 充值记录
查看充值历史，支持一键发起充值指令。

### 4.3 提现记录
- **收款账户联动**：自动加载已配置的银行收款账户，优先选中主账户
- **余额上限校验**：提现金额不得超过可用余额
- **交易密码保护**：须输入 6 位数字交易密码

### 4.4 转账记录 / 代付记录
内部转账支持批量添加收款方，代付记录追踪每笔代付明细。

---

<h2 id="s5">五、信用风控管理（Credit Risk Management）</h2>

平台级商户的授信与风控枢枢。更多信息请参阅 [信用支付产品页](https://www.filixpay.com/products/credit-payment)。

### 5.1 信用额度管理

| 条款类型 | 说明 |
| :--- | :--- |
| `IMMEDIATE` | 即时付款 |
| `NET_DAYS` | 固定天数账期 |
| `END_OF_MONTH` | 月末结清 |
| `ON_DELIVERY` | 货到付款 |
| `STAGE_BASED` | 按阶段付款 |

### 5.2 额度调整记录
完整记录操作人、调整前/后额度、调整金额及时间戳。

### 5.3 信用交易流水

| 交易类型 | 说明 |
| :--- | :--- |
| **USE** | 额度使用 |
| **REPAY** | 信用还款 |
| **ADJUST** | 额度调整 |
| **REFUND** | 退款返还 |

---

<h2 id="s6">六、我的信用（My Credit）</h2>

- **可用额度**：查看各授信方分配的总额度、已用额度、剩余可用
- **额度变动记录**：历次调整的变动前后对比
- **信用支付记录**：信用额度完成的支付/退款/还款明细

---

<h2 id="s7">七、订单管理（Orders）</h2>

交易流水的核心监控引擎。列表含商户订单号、交易流水号、子商户/门店、金额（绿色标识）、状态（SUCCESS = 绿色徽章）。

| 操作 | 触发条件 | 功能描述 |
| :--- | :--- | :--- |
| **发起收款** | 状态 = PENDING | 生成支付令牌，跳转收银台 |
| **发起退款** | SUCCESS + 有可退金额 | 全额/部分退款，自动计算可退余额 |
| **掉单处理** | 状态 ≠ SUCCESS | 向上游补查交易状态 |
| **补单（Patch）** | dealType = PATCH | 一键同步本地与上游状态 |

---

<h2 id="s8">八、退款管理（Refunds）</h2>

独立的退款生命周期追踪。包含退款流水号、退款金额、商户实际退款、退还服务费、退款原因及原订单信息。

---

<h2 id="s9">九、客户管理（Customers）</h2>

跨渠道客户画像管理。支持按姓名、客户号、邮箱、手机号、状态等维度检索。

---

<h2 id="s10">十、线下收款（Offline Collection）</h2>

面向 B2B 银行转账场景的闭环处理中枢，实现**三级审签制度**：

### 10.1 收款账户
管理银行账户：银行名称、支行、开户名、账号、城市。支持设置主账户。

### 10.2 凭证审核（第一道审核）
审核打款凭证（支持放大查看），录入银行交易流水号与付款人信息。三状态流转：待审批 → 通过 / 拒绝。

### 10.3 入账确认（第二道复核）
由独立复核人（Review Operator）执行，与审批人相互制衡。确认入账后资金正式计入余额。

---

<h2 id="s11">十一、代发管理（Payout Management）</h2>

> 仅向平台商户开放

- **代付审核**：第一级审核，决策 APPROVED / REJECTED
- **代付复核**：第二级复核，独立于审核环节，双重校验后方可执行

---

<h2 id="s12">十二、系统设置与开发者</h2>

### 交易密码
邮箱验证码身份验证 → 设置 6 位数字密码（含强度检测） → 完成。

### 服务计划

| 方案 | 价格 | 定位 |
| :--- | :--- | :--- |
| 周付 | 50 USD/周 | 轻松体验 |
| 月付 | 200 USD/月 | 日常运营 |
| 半年 | 1,100 USD/半年 | 性价比之选 |
| 年付 | 2,000 USD/年 | 省心更省钱 |

### 开发者中心
- **API 凭证管理**：配合 [Swagger 文档](https://www.filixpay.com/openapi/v1/swagger) 实现快速接入
- **Webhook 端点管理**：配置回调 URL，支持签名验证
- **Webhook 投递审计**：完整记录每次发送的报文、投递状态与尝试次数

---

<h2 id="s13">十三、支付通道与集成能力</h2>

| 类别 | 渠道 | 了解更多 |
| :--- | :--- | :--- |
| 信用卡/借记卡 | Stripe | [聚合支付](https://www.filixpay.com/products) |
| 数字钱包 | Alipay+、WeChat Pay、PayPal | [跨境电商](https://www.filixpay.com/solutions/cross-border-ecommerce) |
| 加密货币 | NowPayments、Coinbase、OKX Pay | [加密货币支付](https://www.filixpay.com/products/crypto-payment) |
| 线下转账 | 凭证审核 + 双人双签 | [凭证审核](https://www.filixpay.com/dashboard/transfers) |

**集成方式**：收银台独立部署（[GitHub](https://github.com/filixpay/filix-checkout) · [客户实例](https://www.filixpay.com/resources/case-studies)）/ 嵌入式 SDK / [API 直连](https://www.filixpay.com/dashboard/developer)

---

<h2 id="s14">十四、技术架构与安全合规</h2>

- **微服务架构**：Kubernetes 事件驱动，99.99% 可用性
- **身份认证**：Keycloak，OIDC / MFA / WebAuthn(FIDO2)，FAPI 700+ 项测试
- **区块链集成**：多链适配，跨链互信与合规审计
- **合规就绪**：GDPR、PCI-DSS、FATF 旅行规则、等保三级

---

<h2 id="s15">十五、私有化部署方案</h2>

- **极简部署**：4 核 8G 服务器，`docker-compose up`，30 分钟完成
- **数据主权**：100% 私有存储，满足各地合规
- **费用**：28,000 USD 含一年技术维护
- **资源**：[下载中心](https://www.filixpay.com/resources/downloads)（部署指南 · 授权协议 · [API 规范](https://www.filixpay.com/openapi/v1/swagger)）

---

## 联系我们
🌐 官网：[filixpay.com](https://www.filixpay.com)  
📧 商务合作：[invest@filixpay.com](mailto:invest@filixpay.com)  
📖 技术博客：[FilixPay Blog](https://www.filixpay.com/resources/blog)  
💻 开源项目：[GitHub](https://github.com/filixpay/filix-checkout)

© 2026 FilixPay (Filix.com) · 保留所有权利
