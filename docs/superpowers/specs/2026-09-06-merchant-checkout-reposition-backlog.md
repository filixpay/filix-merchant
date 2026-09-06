# Merchant Center Checkout — 重新定位待办（产品边界）

**Date:** 2026-09-06  
**Status:** Backlog — 未排期实现  
**Scope:** 商户中心「收银台 / Checkout」产品与信息架构（**不是**当前 Help 文案批次）  
**Related:**

- 开源前端：`filix-checkout`（用户可 Fork、改 UI/UX、自托管）
- 当前 Dashboard：`/dashboard/checkouts`（Checkout Config / 收银台配置）
- 当前 Help：`/help/payments/checkouts`（描述 **HEAD UI**，产品改造后需同步改写）

---

## 1. 结论（先读）

**商户中心仍然需要 Checkout 相关页面，但不应再做成「收银台设计器」。**

| 问题 | 答案 |
|------|------|
| filix-checkout 已开源，商户中心还要不要收银台？ | **要** |
| 要不要继续做 UI Builder / 布局 / Theme Editor？ | **不要** |
| 商户中心管什么？ | **接入、运行、业务配置、可用支付能力** |
| Checkout 开源项目管什么？ | **页面 UI、布局、CSS/Theme、前端代码、自托管部署** |

一句话：

> **Merchant Center 管理「使用什么能力」；Checkout 决定「怎么呈现这些能力」。**

Checkout 是可替换的前端实现（Payment Experience / Integration Layer），**不是** FilixPay 商户资金能力的所有者。支付执行与账务仍属 FilixPay payment infrastructure（与 filix-checkout README 一致）。

---

## 2. 定位变化

### 现在（易误解）

商户中心 ≈ **配置收银台长什么样**（多语言页面、品牌色、挂配置列表……）——容易被理解成「在门户里设计 Checkout UI」。

### 目标

商户中心 ≈ **管理 FilixPay 收银台的接入、运行和业务配置**

```text
                 Merchant Center
                       │
             管理 Checkout Configuration
                       │
                       ▼
              FilixPay Checkout / Payment API
                       │
                       ▼
              ┌─────────────────┐
              │  filix-checkout │
              │  (或 Hosted /   │
              │   Custom 实现)  │
              │                 │
              │  Fork · 改 UI   │
              │  自行部署        │
              └─────────────────┘
```

支持三类体验，最终都落到 FilixPay Payment Infrastructure：

1. **FilixPay Hosted Checkout**（默认托管）  
2. **Self-hosted filix-checkout**（开源自托管）  
3. **Custom implementation**（自研前端，只接 API）

---

## 3. 建议信息架构（菜单）

**推荐菜单名：`收银台`（Checkout）** — 避免「设计 / 装修 / 配置=改 UI」的联想。

```text
收银台
├── 概览
├── 接入
│     Checkout URL · Environment · Domain
├── 支付
│     Payment Methods · Payment Capabilities
├── 品牌
│     Logo · Business Name · Theme（克制）
└── 开发
      API / Integration · Webhooks · Documentation
```

备选分区写法（与上文等价）：

```text
收银台
├── 概览
├── 接入配置
├── 支付配置
├── 品牌与基础设置
└── 域名 / 环境
```

### 明确不做（归属开源 filix-checkout）

- 拖拽式 UI Builder  
- 页面布局编辑器  
- CSS / Theme Editor（复杂主题编辑）  
- 自定义 Checkout 前端代码编辑  
- Checkout 组件设计器  

---

## 4. V1 平台侧配置范围（建议）

只保留真正属于平台侧的东西。

### 4.1 Checkout Endpoint

| 模式 | 示例 |
|------|------|
| 默认 Hosted | `https://checkout.filixpay.com` |
| Custom / Self-hosted | `https://checkout.example.com` / `https://pay.example.com` |

商户中心字段：**Checkout URL**（必填语义：买家跳转 / 打开的 Checkout 入口）。

### 4.2 Payment Capability（不是 Payment Runtime）

商户中心配置的是：

> **哪些 Payment Capability 对该商户的 Checkout 可用。**

例如（示意）：Card / PayPal / Alipay / WeChat Pay / USDT。

**边界：** 不在商户中心配置 Payment Runtime。链路仍为：

```text
Checkout → Payment Session → Payment Routing → Payment Runtime → Provider
```

由 FilixPay 后端控制。

### 4.3 Branding（克制）

属于业务配置，由 Checkout 前端决定如何渲染：

```json
{
  "branding": {
    "logo": "...",
    "name": "Merchant",
    "primaryColor": "#..."
  }
}
```

建议字段：Logo · Business name · Primary color · Locale · Supported languages。  
**不是**完整 Theme / CSS Builder。

### 4.4 Environment（为自托管与开发者预留）

| Environment | Checkout URL | API Environment |
|-------------|--------------|-----------------|
| Production | … | Production |
| Sandbox | … | Sandbox |

开源 Checkout 主要服务开发者；环境分离是关键架构位，**建议现在就预留**，即使 UI 后做。

### 4.5 自定义 Checkout 模式位（架构预留）

| 商户 | Checkout 模式 |
|------|----------------|
| A | Hosted by FilixPay |
| B | Self-hosted（`https://checkout.merchant.com`） |
| C | Custom integration |

三种都调用 FilixPay Payment Infrastructure。产品与 API 设计时预留 **Checkout hosting mode**，避免日后只能「单 URL 字段」硬拧。

---

## 5. 职责对照表

| 能力 | filix-checkout（开源） | Merchant Center |
|------|------------------------|-----------------|
| 页面 UI | ✅ | ❌ |
| 页面布局 | ✅ | ❌ |
| CSS / Theme（实现） | ✅ | ❌ |
| Checkout 代码 | ✅ | ❌ |
| 自托管部署 | ✅ | ❌ |
| Checkout URL | — | ✅ |
| Environment | — | ✅ |
| Payment Methods / Capability 开关 | — | ✅ |
| 商户 Logo / 名称（品牌配置） | 消费配置 | ✅ 下发配置 |
| 域名 | 运维侧 | ✅ 登记 / 校验（按产品） |
| API / Webhook 配置入口 | 文档链出 | ✅（可链到开发者中心） |

---

## 6. 与当前 HEAD 的差距（改造时必做）

当前 `/dashboard/checkouts`（Checkout Config）更接近「多收银台计数器 + 表单配置品牌与挂载 Payment Configs」，**尚未**按上文「接入 / 能力 / 环境 / Hosting mode」拆页。

改造落地时建议按序：

1. **产品规格**：冻结菜单 IA、字段清单、Hosted / Self-hosted / Custom 状态机  
2. **API**：Checkout Configuration 资源与 Capability 授权模型（与 Runtime 解耦）  
3. **Dashboard IA**：从单页「收银台配置」迁到「收银台」分区导航  
4. **Help**：重写 `/help/payments/checkouts`（及可能的 `#接入` / `#支付` / `#品牌` 锚点），删除「设计器」暗示  
5. **Marketing / Developers**：自托管部署仍只在开源仓库 + Marketing Developers，不塞进商户中心  

---

## 7. 待办清单（实现前勾选）

### 产品 / 架构

- [ ] 书面冻结：Checkout = 可替换 Experience Layer；资金与 Runtime 属平台  
- [ ] 定义 Hosting mode：`HOSTED` | `SELF_HOSTED` | `CUSTOM`  
- [ ] 定义 Configuration 资源字段：Checkout URL、Environment、Branding、Capability allow-list  
- [ ] 明确 Capability 与现有 Payment Config / Channel 的映射关系（避免双源配置）  
- [ ] Sandbox / Production 成对环境模型  

### 商户中心 UI

- [ ] 菜单改名：**收银台**（弃用「设计 / 装修」；评估是否弃用「收银台配置」作主标题）  
- [ ] 信息架构：概览 / 接入 / 支付 / 品牌 / 开发（或等价分区）  
- [ ] **不做** UI Builder / 布局编辑器 / CSS Editor / 组件设计器  
- [ ] 概览展示：当前 mode、Checkout URL、环境、能力摘要  

### 开源与文档

- [ ] filix-checkout README：强调读平台 Configuration、不在门户改 UI  
- [ ] Merchant Help：产品改造后同步改写 `payments/checkouts`  
- [ ] Developers：API 文档链到 Configuration + Payment Session，不链到「门户设计器」  

### 明确不做（本待办范围内）

- [ ] ~~在商户中心重建 Checkout 前端设计器~~  
- [ ] ~~在商户中心编辑 Checkout 源码 / CSS~~  
- [ ] ~~把 Payment Runtime / Provider 密钥编排塞进「收银台」当主路径~~（通道密钥仍走现有支付通道 / 开发者配置）  

---

## 8. 成功标准（改造完成后）

- 商户能区分：**Hosted vs Self-hosted vs Custom**，并登记 Checkout URL 与环境。  
- 商户能开关 **Payment Capability**，但不在收银台页配置 Runtime。  
- 品牌字段仅为克制业务配置，由任意 Checkout 实现消费。  
- 门户文案与 Help **不再**暗示「在这里设计收银台页面」。  
- 开源 filix-checkout 仍是 UI/UX 变更的主战场。

---

## 9. 备注

本文档仅记录产品边界与待办，**不授权**立即改 Dashboard 或 Help。排期启动时另开实现规格（建议文件名：`YYYY-MM-DD-merchant-checkout-reposition-design.md`），并回链本文。
