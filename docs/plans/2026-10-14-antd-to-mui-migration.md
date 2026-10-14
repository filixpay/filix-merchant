# Ant Design → MUI 迁移计划

> **For Antigravity:** REQUIRED SUB-SKILL: Load executing-plans to implement this plan task-by-task.

**Goal:** 将 filix-merchant 商户中心从 Ant Design v6 全面迁移至 MUI v6（Material UI），在保持现有视觉风格和功能的同时，消除对 `antd` 的所有依赖。

**Architecture:** 分 8 个阶段按风险由低到高推进，先建立 MUI 基础设施（主题、Provider、SSR 集成），再按模块逐步替换组件，最后移除旧依赖。每个阶段独立可构建，不破坏运行中的应用。

**Tech Stack:** Next.js 16 (App Router), React 19, MUI v6 (`@mui/material`, `@mui/x-date-pickers`), `dayjs`, `lucide-react`, `next-intl`

---

## 规模评估

| 指标 | 数字 |
|------|------|
| 总 TSX 文件数 | 324 |
| 引用 `antd` 的源文件 | **196** |
| 引用 `@ant-design/*` 的源文件 | ~48 |
| 核心 layout 文件 | 39 |
| 业务组件目录 | 33 个模块 |

## Ant Design → MUI 组件映射表

| Ant Design | MUI 等价组件 | 备注 |
|---|---|---|
| `Layout`, `Sider`, `Content`, `Header` | `Box` + Flexbox | Layout 用原生 div+CSS 替代更简洁 |
| `Menu` (inline/collapse) | `Drawer` + `List`/`ListItemButton` | 侧边栏导航 |
| `Table` | `@mui/x-data-grid` 或 `Table`/`TableBody` | 列表页用 DataGrid |
| `Button` | `Button` | variant: `contained`/`outlined`/`text` |
| `Input`, `Input.Search` | `TextField` | variant: `outlined` |
| `Select` | `Select` + `MenuItem` / `Autocomplete` | |
| `DatePicker`, `RangePicker` | `@mui/x-date-pickers` DatePicker | 需要 `AdapterDayjs` |
| `Form` | `react-hook-form` + MUI 控件 | 移除 antd Form 状态管理 |
| `Modal` | `Dialog` | |
| `Drawer` | `Drawer` | |
| `Card` | `Card` + `CardContent` | |
| `Tag` | `Chip` | |
| `Alert` | `Alert` | |
| `Spin` | `CircularProgress` | |
| `Typography` | `Typography` | variant: h1-h6, body1, body2, caption |
| `Statistic` | 自定义 `StatCard` 组件 | |
| `Descriptions` | 自定义 `DescriptionGrid` 组件 | |
| `Tabs` | `Tabs` + `Tab` | |
| `Steps` | `Stepper` | |
| `Timeline` | `Timeline` (`@mui/lab`) | |
| `Collapse` | `Accordion` | |
| `Pagination` | `Pagination` / DataGrid 内置 | |
| `Breadcrumb` | `Breadcrumbs` | |
| `Tooltip` | `Tooltip` | |
| `Popconfirm` | `Popover` + `Button` 组合 | |
| `Dropdown` | `Menu` + `MenuItem` | MUI Menu 对应 antd Dropdown |
| `Badge` | `Badge` | |
| `Avatar` | `Avatar` | |
| `Space` | `Stack` (direction="row") | |
| `Flex` | `Stack` / `Box sx={{ display: 'flex' }}` | |
| `Row` / `Col` | `Grid` | |
| `Upload` | `Button` + `input[type=file]` | |
| `message` (全局通知) | `notistack` useSnackbar | |
| `notification` | `notistack` 库 | |
| `ConfigProvider` | `ThemeProvider` + `createTheme` | |
| `App` (antd wrapper) | 移除，用 `ThemeProvider` 替代 | |
| `AntdRegistry` | `AppRouterCacheProvider` (`@mui/material-nextjs`) | Next.js SSR 支持 |

---

## Phase 0：前期准备与决策确认

> **预计工时：0.5 天** | **风险：低**

### Task 0.1：技术选型确认

在写代码前先确认以下决策：

1. **表格方案**：`@mui/x-data-grid`（社区版免费，内置排序/分页/虚拟滚动）**推荐**，项目有 15+ 列表页，统一封装收益大。

2. **表单方案**：**推荐** `react-hook-form` + MUI 控件。antd Form 侵入业务代码量大，同步换 react-hook-form 降低长期维护成本。

3. **全局通知**：**推荐** `notistack`（支持 imperative 调用，最小改动替代 `message.success()`）。

4. **图标**：项目已用 `lucide-react`（菜单已全部切换），无需引入 MUI 图标。

5. **日期**：项目用 `dayjs`，MUI x-date-pickers 支持 dayjs adapter，无缝对接。

### Task 0.2：React 19 兼容性

MUI v6 对 React 19 支持为 RC 阶段，生产建议用 `--legacy-peer-deps` 安装：

```bash
npm install @mui/material @mui/system @emotion/react @emotion/styled @mui/x-date-pickers @mui/lab @mui/material-nextjs notistack --legacy-peer-deps
npm install --save-dev @mui/types
```

### Task 0.3：阅读现有设计令牌

当前设计令牌在两处：
- `src/app/globals.css`（CSS 变量，`--primary-*`, `--slate-*`）
- `src/app/providers.tsx`（antd ThemeConfig，包含颜色、间距、组件 override）

迁移时这些值全部映射到 MUI `createTheme`。

---

## Phase 1：MUI 基础设施

> **预计工时：1 天** | **风险：低**（不改业务组件，仅加基础设施）

### Task 1.1：安装依赖

**Step 1：安装**

```bash
npm install @mui/material @mui/system @emotion/react @emotion/styled \
    @mui/x-date-pickers @mui/lab @mui/material-nextjs notistack \
    --legacy-peer-deps
```

预期输出：`added N packages`（无 peer dep 错误）

**Step 2：验证安装**

```bash
node -e "require('@mui/material/Button'); console.log('MUI OK')"
```

预期：打印 `MUI OK`

**Step 3：Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add MUI v6, x-date-pickers, emotion, notistack"
```

### Task 1.2：创建 MUI Theme 文件

**Files:**
- Create: `src/lib/theme/mui-theme.ts`

将现有 antd `dashboardTheme` 的设计令牌翻译为 MUI `createTheme`：

```typescript
// src/lib/theme/mui-theme.ts
import { createTheme } from "@mui/material/styles";
import { zhCN } from "@mui/material/locale";

export const muiTheme = createTheme(
    {
        palette: {
            primary: {
                main: "#2563eb",
                light: "#3b82f6",
                dark: "#1d4ed8",
                contrastText: "#ffffff",
            },
            text: {
                primary: "#1e293b",
                secondary: "#64748b",
                disabled: "#94a3b8",
            },
            background: {
                default: "#ffffff",
                paper: "#ffffff",
            },
            divider: "#e2e8f0",
            error: { main: "#dc2626" },
            success: { main: "#16a34a" },
            warning: { main: "#d97706" },
        },
        typography: {
            fontFamily:
                "var(--font-geist-sans), var(--font-noto-sans-sc), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: 14,
            h1: { fontSize: 28, fontWeight: 600, lineHeight: 1.3 },
            h2: { fontSize: 22, fontWeight: 600, lineHeight: 1.35 },
            h3: { fontSize: 18, fontWeight: 600, lineHeight: 1.4 },
            h4: { fontSize: 15, fontWeight: 600, lineHeight: 1.45 },
            body1: { fontSize: 14, lineHeight: 1.65 },
            body2: { fontSize: 13, lineHeight: 1.6 },
            caption: { fontSize: 12, lineHeight: 1.5, color: "#64748b" },
        },
        shape: { borderRadius: 6 },
        spacing: 4, // 1 unit = 4px
        components: {
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        fontWeight: 500,
                        textTransform: "none",
                        height: 34,
                        paddingInline: 16,
                        fontSize: 13,
                    },
                    sizeSmall: { height: 28, fontSize: 12 },
                },
            },
            MuiTextField: {
                defaultProps: { size: "small", variant: "outlined" },
                styleOverrides: {
                    root: { "& .MuiInputBase-root": { height: 34 } },
                },
            },
            MuiSelect: { defaultProps: { size: "small" } },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        border: "1px solid #eef2f6",
                        boxShadow:
                            "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
                    },
                },
            },
            MuiDialog: {
                styleOverrides: { paper: { borderRadius: 10 } },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontSize: 12, height: 22, borderRadius: 4 },
                },
            },
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        "& .MuiTableCell-root": {
                            backgroundColor: "#ffffff",
                            color: "#64748b",
                            fontWeight: 500,
                            fontSize: 12,
                            borderBottom: "1px solid #e2e8f0",
                            padding: "10px 16px",
                            whiteSpace: "nowrap",
                        },
                    },
                },
            },
            MuiTableBody: {
                styleOverrides: {
                    root: {
                        "& .MuiTableCell-root": {
                            fontSize: 13,
                            color: "#1e293b",
                            borderBottom: "1px solid #f1f5f9",
                            padding: "12px 16px",
                        },
                        "& .MuiTableRow-root:hover .MuiTableCell-root": {
                            backgroundColor: "#f8fafc",
                        },
                        "& .MuiTableRow-root:last-child .MuiTableCell-root": {
                            borderBottom: "none",
                        },
                    },
                },
            },
            MuiPagination: {
                styleOverrides: {
                    root: { padding: "12px 16px", borderTop: "1px solid #f1f5f9" },
                },
            },
        },
    },
    zhCN, // 中文本地化
);
```

**Step：Commit**
```bash
git add src/lib/theme/mui-theme.ts
git commit -m "feat(theme): add MUI theme matching existing design tokens"
```

### Task 1.3：创建 MUI Provider（并存阶段）

在迁移过渡期，antd 和 MUI Provider **同时存在**。先在 antd 外层包裹 MUI Provider。

**Files:**
- Modify: `src/app/providers.tsx`

增加 import：

```typescript
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";
import { muiTheme } from "@/lib/theme/mui-theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/zh-cn";
```

Providers 返回值结构（现有 antd 结构作为内层不动）：

```tsx
return (
    <AppRouterCacheProvider>
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
                <SnackbarProvider maxSnack={3}>
                    {/* 现有 SessionProvider + antd 结构保持不动 */}
                    <SessionProvider basePath="/auth-api/auth" ...>
                        <QueryClientProvider client={queryClient}>
                            <QueryCacheOnSignOut>
                                <AntdRegistry>
                                    <ConfigProvider theme={dashboardTheme}>
                                        <App>{children}</App>
                                    </ConfigProvider>
                                </AntdRegistry>
                            </QueryCacheOnSignOut>
                        </QueryClientProvider>
                    </SessionProvider>
                </SnackbarProvider>
            </LocalizationProvider>
        </ThemeProvider>
    </AppRouterCacheProvider>
);
```

> **注意**：`AppRouterCacheProvider` 解决 MUI emotion 在 Next.js App Router 下的 SSR 样式注水问题（等价于 antd 的 `AntdRegistry`）。必须步骤，否则生产构建会有 CSS 闪烁（FOUC）。

**Step：验证构建**
```bash
npm run build
```
预期：构建成功，0 TS errors

**Step：Commit**
```bash
git add src/app/providers.tsx
git commit -m "feat(providers): add MUI ThemeProvider + emotion SSR support (coexistence mode)"
```

### Task 1.4：创建共用 MUI 基础组件

**Files:**
- Create: `src/components/ui/LoadingSpinner.tsx`
- Create: `src/components/ui/StatCard.tsx`
- Create: `src/components/ui/DescriptionGrid.tsx`
- Create: `src/components/ui/ConfirmDialog.tsx`

```typescript
// src/components/ui/LoadingSpinner.tsx
import { Box, CircularProgress, Typography } from "@mui/material";

export function LoadingSpinner({ tip }: { tip?: string }) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center"
             justifyContent="center" minHeight={200} gap={2}>
            <CircularProgress size={32} />
            {tip && <Typography variant="body2" color="text.secondary">{tip}</Typography>}
        </Box>
    );
}
```

```typescript
// src/components/ui/StatCard.tsx
import { Box, Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
    title: string;
    value: string | number;
    suffix?: string;
    extra?: React.ReactNode;
}

export function StatCard({ title, value, suffix, extra }: StatCardProps) {
    return (
        <Card>
            <CardContent>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    {title}
                </Typography>
                <Box display="flex" alignItems="baseline" gap={0.5}>
                    <Typography variant="h4"
                        sx={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                        {value}
                    </Typography>
                    {suffix && (
                        <Typography variant="body2" color="text.secondary">{suffix}</Typography>
                    )}
                </Box>
                {extra}
            </CardContent>
        </Card>
    );
}
```

```typescript
// src/components/ui/DescriptionGrid.tsx — 替代 antd Descriptions
import { Grid, Typography } from "@mui/material";

interface DescriptionItem {
    label: string;
    value: React.ReactNode;
    span?: number;
}

export function DescriptionGrid({
    items,
    columns = 2,
}: {
    items: DescriptionItem[];
    columns?: number;
}) {
    return (
        <Grid container spacing={2}>
            {items.map(({ label, value, span = 1 }, i) => (
                <Grid item xs={12} sm={(12 / columns) * span} key={i}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {label}
                    </Typography>
                    <Typography variant="body2" color="text.primary" mt={0.5}>
                        {value ?? "—"}
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
}
```

**Step：Commit**
```bash
git add src/components/ui/
git commit -m "feat(ui): add shared MUI base components (LoadingSpinner, StatCard, DescriptionGrid)"
```

---

## Phase 2：Layout Shell 迁移

> **预计工时：2 天** | **风险：高**（影响所有 dashboard 页面）
> **策略：在 feature branch 完成，PR review 后合并**

### Task 2.1：迁移 DashboardLayout（核心）

**Files:**
- Modify: `src/components/layout/DashboardLayout.tsx`
- Modify: `src/components/layout/EnterpriseDashboardLayout.tsx`
- Modify: `src/app/globals.css`

**关键变化：**
1. `<Layout hasSider>` → `<Box sx={{ display: 'flex' }}>`
2. `<Sider>` → MUI `<Drawer variant="permanent">` (桌面) / `variant="temporary"` (手机)
3. `<Content>` → `<Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>`
4. `<Spin>` → `<CircularProgress>`
5. `<Alert>` → MUI `<Alert>`

**Sider 替换模式：**

```tsx
// 替换前：
<Sider width={256} collapsedWidth={64} collapsed={isCollapsed} trigger={null}>
    ...
</Sider>

// 替换后（桌面端 permanent Drawer）：
<Drawer
    variant="permanent"
    sx={{
        width: isCollapsed ? 64 : 256,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
            width: isCollapsed ? 64 : 256,
            boxSizing: "border-box",
            border: "none",
            borderRight: "1px solid #e2e8f0",
            transition: "width 0.2s ease",
            overflowX: "hidden",
        },
    }}
>
    ...
</Drawer>
```

**`globals.css` 需要删除的段落（已被 MUI theme overrides 覆盖）：**
- `html[data-sidebar-collapsed] .dashboard-shell-main` 规则
- `.dashboard-shell-sider.ant-layout-sider` 规则
- `dashboard-typography .ant-table-*` 所有规则
- `.dashboard-typography .ant-pagination` 规则
- `.dashboard-typography .ant-tag` 规则
- `.dashboard-typography .ant-card` 规则
- `.dashboard-typography .ant-modal-*` 规则
- `.dashboard-typography .ant-form-*` 规则
- `.dashboard-typography .ant-descriptions-*` 规则

**Step：本地验证**
```bash
npm run dev
# 访问 http://localhost:3000/zh/dashboard
# 检查：侧边栏展开/收起、菜单选中高亮、手机响应式遮罩
```

**Step：构建验证**
```bash
npm run build
```

**Step：Commit**
```bash
git add src/components/layout/DashboardLayout.tsx src/app/globals.css
git commit -m "feat(layout): replace antd Layout/Sider with MUI Drawer-based shell"
```

### Task 2.2：迁移侧边栏菜单

**Files:**
- Modify: `src/components/layout/dashboard-menu.tsx`
- Modify: `src/components/layout/layout.module.css`

将 `toAntdMenuItems` 改为返回 React 节点的 `MuiMenuItems`，用 MUI `List` + `ListItemButton` + `Collapse` 替代 antd `Menu`：

```tsx
export function MuiMenuItems({ menuModel, locale, selectedKey, openKeys, onOpenChange, onNavigate, isCollapsed }: MuiMenuItemsProps) {
    return (
        <List dense disablePadding>
            {menuModel
                .filter((m) => m.visible !== false)
                .map((menuItem) => (
                    <MuiMenuItem key={menuItem.key} item={menuItem} locale={locale}
                        selectedKey={selectedKey} openKeys={openKeys}
                        onOpenChange={onOpenChange} onNavigate={onNavigate}
                        isCollapsed={isCollapsed} />
                ))}
        </List>
    );
}
```

**Step：Commit**
```bash
git add src/components/layout/dashboard-menu.tsx src/components/layout/layout.module.css
git commit -m "feat(menu): replace antd Menu with MUI List-based sidebar nav"
```

### Task 2.3：迁移 Header、Breadcrumb、UserMenu

**Files:**
- Modify: `src/components/layout/DashboardHeader.tsx`
- Modify: `src/components/layout/DashboardBreadcrumb.tsx`
- Modify: `src/components/layout/UserMenu.tsx`

- `antd Breadcrumb` → `MUI Breadcrumbs`
- `antd Dropdown` (用户菜单) → `MUI Menu` + `MenuItem`

**Step：Commit**
```bash
git add src/components/layout/DashboardHeader.tsx src/components/layout/DashboardBreadcrumb.tsx src/components/layout/UserMenu.tsx
git commit -m "feat(layout): migrate header, breadcrumb, user menu to MUI"
```

### Task 2.4：迁移 WorkspaceSwitcher/OrganizationSwitcher

**Files:**
- Modify: `src/components/layout/WorkspaceSwitcher.tsx`
- Modify: `src/components/layout/OrganizationSwitcher.tsx`
- Modify: `src/components/layout/MerchantBusinessSwitcher.tsx`
- Modify: `src/components/layout/EnterpriseSwitcher.tsx`

涉及 antd `Dropdown`, `Select`, `Avatar`, `Typography`，全部替换为 MUI 等价组件。

**Step：Commit**
```bash
git add src/components/layout/
git commit -m "feat(layout): migrate workspace/org switchers to MUI"
```

---

## Phase 3：设计系统原语组件

> **预计工时：1 天** | **风险：低**

**Files:**
- Modify: `src/components/layout/StatusBadge.tsx` — antd Tag → MUI Chip
- Modify: `src/components/layout/AmountCell.tsx` — antd Typography → MUI Typography
- Modify: `src/components/layout/DateTimeCell.tsx` — antd Typography → MUI Typography
- Modify: `src/components/layout/DashboardPage.tsx` — antd Typography → MUI Typography
- Modify: `src/components/layout/DashboardTableEmpty.tsx` — antd Empty → 自定义 Box
- Modify: `src/components/layout/DashboardTableError.tsx` — antd Alert → MUI Alert

**StatusBadge 迁移示例：**

```tsx
import Chip from "@mui/material/Chip";

const statusColorMap: Record<string, { bg: string; color: string }> = {
    ACTIVE: { bg: "#dcfce7", color: "#166534" },
    INACTIVE: { bg: "#f1f5f9", color: "#475569" },
    SUSPENDED: { bg: "#fef9c3", color: "#854d0e" },
    // ...其余状态颜色
};

<Chip
    label={status}
    size="small"
    sx={{
        fontSize: 11,
        height: 20,
        borderRadius: "4px",
        backgroundColor: colorMap.bg,
        color: colorMap.color,
        fontWeight: 500,
    }}
/>
```

**Step：Commit**
```bash
git add src/components/layout/
git commit -m "feat(design-system): migrate shared primitives to MUI (StatusBadge, AmountCell, DateTimeCell)"
```

---

## Phase 4：数据展示组件（列表页）

> **预计工时：4 天** | **风险：中**（改变用户可见的 UI，但每个模块独立）

### 迁移策略：`@mui/x-data-grid`

```tsx
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    {
        field: "tradeNo",
        headerName: "交易号",
        width: 180,
        renderCell: ({ row }) => <OrderIdCell order={row} />,
    },
];

<DataGrid
    rows={data?.content ?? []}
    columns={columns}
    rowCount={data?.total ?? 0}
    paginationMode="server"
    paginationModel={{ page, pageSize }}
    onPaginationModelChange={({ page, pageSize }) => { setPage(page); setPageSize(pageSize); }}
    pageSizeOptions={[20, 50, 100]}
    loading={isLoading}
    disableRowSelectionOnClick
    sx={{ border: "none" }}
    slots={{ noRowsOverlay: () => <DashboardTableEmpty /> }}
/>
```

> **注意**：DataGrid 要求每行有 `id` 字段。若 API 数据无 `id`，需传 `getRowId={(row) => row.tradeNo}` 等。

### 迁移顺序（按模块）

| 顺序 | 文件 | 主要涉及的 antd 组件 |
|------|------|---------------------|
| 1 | `src/components/orders/OrderListTable.tsx` | Table, Dropdown, Tag, Space |
| 2 | `src/components/refunds/RefundListTable.tsx` | Table, Tag |
| 3 | `src/components/settlements/SettlementTable.tsx` | Table, Tag |
| 4 | `src/components/payment-splits/PaymentSplitTable.tsx` | Table, Tag |
| 5 | `src/components/reporting/TransactionListTable.tsx` | Table, Tag |
| 6 | `src/components/risk-reviews/RiskReviewTable.tsx` | Table, Tag |
| 7 | `src/components/disputes/DisputeListTable.tsx` | Table, Badge, Tag |
| 8 | `src/components/fraud/FraudEventTable.tsx` | Table |
| 9 | `src/components/sub-merchants/SubMerchantTable.tsx` | Table |
| 10 | `src/components/locations/LocationTable.tsx` | Table |
| 11 | `src/components/checkouts/CheckoutTable.tsx` | Table |
| 12 | `src/components/transfer-audit/TransferAuditTable.tsx` | Table |
| 13 | `src/components/transaction-reconciliation/TransactionReconTable.tsx` | Table |
| 14 | `src/components/settlement-statements/SettlementStatementTable.tsx` | Table |
| 15 | `src/components/risk/RiskRuleTable.tsx` | Table |
| 16 | 各 dashboard page.tsx 中的 Filter/Toolbar 区域 | Button, DatePicker, Select, Space, Flex |

**页面 Toolbar 替换速查：**

```tsx
// Space → Stack
<Stack direction="row" spacing={1}>...</Stack>

// Flex → Box/Stack
<Stack direction="row" gap={1}>...</Stack>

// DatePicker (antd) → MUI x-date-pickers
import { DatePicker } from "@mui/x-date-pickers";
<DatePicker onChange={...} slotProps={{ textField: { size: "small" } }} />

// Input.Search → TextField with endAdornment
<TextField size="small" placeholder="搜索..."
    InputProps={{ endAdornment: <SearchIcon size={14} /> }}
    onKeyDown={(e) => e.key === "Enter" && onSearch(e.currentTarget.value)} />
```

**每个模块 commit 格式：**
```bash
git commit -m "feat(orders): migrate OrderListTable to MUI DataGrid"
```

---

## Phase 5：表单和 Modal 组件

> **预计工时：3 天** | **风险：高**（antd Form 有状态管理，需同步迁移 react-hook-form）

### Task 5.1：安装 react-hook-form

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Task 5.2：通用迁移模式

```tsx
// 替换前（antd Form 模式）：
const [form] = Form.useForm();
<Form form={form} onFinish={onSubmit} layout="vertical">
    <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
        <Input />
    </Form.Item>
</Form>

// 替换后（react-hook-form + MUI）：
const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
<Box component="form" onSubmit={handleSubmit(onSubmit)}>
    <TextField label="邮箱" fullWidth size="small"
        error={!!errors.email} helperText={errors.email?.message}
        {...register("email", { required: "邮箱必填" })} />
</Box>
```

**Modal 迁移模式：**

```tsx
// antd Modal → MUI Dialog
<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>创建订单</DialogTitle>
    <DialogContent dividers>
        ...
    </DialogContent>
    <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button variant="contained" type="submit">确认</Button>
    </DialogActions>
</Dialog>
```

### 迁移顺序（Modal + Form）

| 文件 | 主要 antd 组件 |
|------|----------------|
| `src/components/orders/CreateOrderModal.tsx` | Form, Input, Select, InputNumber, Modal |
| `src/components/orders/PaymentModal.tsx` | Form, Input, Modal |
| `src/components/orders/MissingOrderModal.tsx` | Form, Input, Modal |
| `src/components/orders/OrderDetailsModal.tsx` | Descriptions, Modal, Tabs, Steps |
| `src/components/refunds/CreateRefundModal.tsx` | Form, Input, Modal |
| `src/components/refunds/RefundDetailsModal.tsx` | Descriptions, Modal, Tabs |
| `src/components/sub-merchants/CreateSubMerchantModal.tsx` | Form, Input, Select, Modal |
| `src/components/sub-merchants/EditSubMerchantModal.tsx` | Form, Input, Select, Modal |
| `src/components/payment-splits/PaymentSplitDetailsModal.tsx` | Descriptions, Modal |
| `src/components/risk-reviews/RiskReviewDetailView.tsx` | Descriptions, Tabs |
| `src/components/settlement-statements/SettlementStatementDetailView.tsx` | Descriptions, Tabs |
| `src/components/configs/EditConfigModal.tsx` | Form, Input, Select, Modal |
| `src/components/money/CreateExternalAccountModal.tsx` | Form, Input, Modal |
| `src/components/onboarding/SchemaDynamicForm.tsx` | Form (dynamic, 高风险) |
| `src/components/organization/RoleEditorModal.tsx` | Form, Modal |
| `src/components/transfer-audit/TransferAuditModal.tsx` | Modal, Descriptions |
| `src/components/transfer-audit/TransferReviewModal.tsx` | Form, Modal |

> **⚠️ 高风险文件：`SchemaDynamicForm.tsx`**
> 动态表单生成器，使用了 antd Form 的 `watch`、条件显隐和复杂验证规则。迁移前需深入阅读该文件，用 `react-hook-form` 的 `useFieldArray` 和 `watch()` 重构。**单独排期**，不与其他 Modal 并行。

**每个 Modal commit 格式：**
```bash
git commit -m "feat(orders): migrate CreateOrderModal to MUI Dialog + react-hook-form"
```

---

## Phase 6：Timeline / 复杂场景组件

> **预计工时：2 天** | **风险：中**

| 文件 | 替换方案 |
|------|----------|
| `src/components/orders/OrderLifecycleTimeline.tsx` | `@mui/lab/Timeline` |
| `src/components/maintenance/ChangeStatusTimeline.tsx` | `@mui/lab/Timeline` |
| `src/components/onboarding/ApplicationStatusTimeline.tsx` | `@mui/lab/Timeline` |
| `src/components/risk/PaymentRiskTimeline.tsx` | `@mui/lab/Timeline` |
| `src/components/disputes/ImmutableTimeline.tsx` | `@mui/lab/Timeline` |
| `src/components/orders/OrderStatsCards.tsx` | `StatCard` 组件 |
| `src/components/disputes/DisputeOperationalKpis.tsx` | `StatCard` 组件 |
| `src/components/risk/RiskDashboardKpis.tsx` | `StatCard` 组件 |
| `src/components/reporting/WidgetCard.tsx` | MUI `Card` |
| `src/components/reporting/WidgetBar.tsx` | MUI `Box` |
| `src/components/reporting/TransactionDetailSummary.tsx` | `DescriptionGrid` |
| `src/components/reporting/TransactionTimelinePanel.tsx` | `@mui/lab/Timeline` |
| `src/components/disputes/MerchantActionCenter.tsx` | MUI `Paper` + `Alert` |
| `src/components/configs/ScenarioCard.tsx` | MUI `Card` |
| `src/components/configs/ConfigChannelRow.tsx` | MUI `TableRow` |
| `src/components/onboarding/ApplicationStatusSummary.tsx` | MUI `Card` + `Stepper` |
| `src/components/onboarding/OnboardingConfirmSummary.tsx` | `DescriptionGrid` |
| `src/components/onboarding/ApplicationDocumentField.tsx` | MUI Button + input hidden |
| `src/components/notifications/TaskUrgencyBanner.tsx` | MUI `Alert` |
| `src/components/support/SupportDrawer.tsx` | MUI `Drawer` |
| `src/components/support/SupportFloatingEntry.tsx` | MUI `Fab` |

**Timeline 迁移示例：**

```tsx
// antd Timeline:
<Timeline items={[{ color: "green", children: "事件内容", label: "2024-01-01" }]} />

// MUI Timeline:
import { Timeline, TimelineItem, TimelineContent, TimelineDot,
    TimelineConnector, TimelineSeparator, TimelineOppositeContent } from "@mui/lab";

<Timeline>
    <TimelineItem>
        <TimelineOppositeContent variant="caption" color="text.secondary">
            2024-01-01
        </TimelineOppositeContent>
        <TimelineSeparator>
            <TimelineDot color="success" />
            <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>事件内容</TimelineContent>
    </TimelineItem>
</Timeline>
```

**Step：按文件逐一 commit**

---

## Phase 7：Developer / 其他边缘模块

> **预计工时：2 天** | **风险：低**

目录清单：
- `src/components/developer/*`：各 Panel 和 Modal
- `src/components/commerce/*`：ProductImageUploader（Upload 替换）、activation
- `src/components/credit/*`
- `src/components/crypto-deposit-wallets/*`
- `src/components/help/*`
- `src/components/legal/*`
- `src/components/marketing/*`（HeroSection 等）

**Upload 替换（ProductImageUploader）：**

```tsx
// antd Upload → MUI Button + hidden input
<Button component="label" variant="outlined" startIcon={<UploadIcon size={14} />}>
    上传图片
    <input type="file" hidden accept="image/*" onChange={handleUpload} />
</Button>
```

**Step：按目录 commit**
```bash
git commit -m "feat(developer): migrate developer dashboard components to MUI"
git commit -m "feat(commerce): migrate product management components to MUI"
```

---

## Phase 8：移除 Ant Design 依赖（清理）

> **预计工时：0.5 天** | **风险：低**（仅在所有迁移完成且构建通过后执行）

### Task 8.1：验证 antd 零引用

```powershell
Get-ChildItem -Path "src" -Include "*.tsx","*.ts" -Recurse |
    Select-String -Pattern 'from "antd"' |
    Select-Object Path, LineNumber, Line
```
预期：**0 结果**

```powershell
Get-ChildItem -Path "src" -Include "*.tsx","*.ts" -Recurse |
    Select-String -Pattern '@ant-design' |
    Select-Object Path, LineNumber, Line
```
预期：**0 结果**

### Task 8.2：移除依赖

```bash
npm uninstall antd @ant-design/icons @ant-design/nextjs-registry
```

### Task 8.3：清理 providers.tsx

从 `src/app/providers.tsx` 移除：
- `import { AntdRegistry }`
- `import { App, ConfigProvider } from "antd"`
- `import type { ThemeConfig } from "antd"`
- `dashboardTheme` 对象
- JSX 中的 `<AntdRegistry>`, `<ConfigProvider>`, `<App>` 节点

### Task 8.4：清理 globals.css

移除所有 `dashboard-typography .ant-*` 段落（已在 Phase 2 转移到 MUI theme overrides 中）。

### Task 8.5：最终构建验证

```bash
npm run build
npm run test
```

预期：TypeScript errors: 0，Build: 通过，现有测试: 通过

### Task 8.6：最终 Commit

```bash
git add .
git commit -m "chore: remove antd dependency — complete MUI migration"
git tag v-mui-migration-complete
```

---

## 重要注意事项

### SSR / Hydration

- MUI 必须使用 `AppRouterCacheProvider`（来自 `@mui/material-nextjs`）包裹整个应用，否则在 Next.js App Router 下会出现 CSS 样式闪烁（FOUC）。
- `@mui/x-data-grid` 行的 `id` 字段是必须的，迁移时若数据无 `id` 需手动添加 `getRowId` prop。
- 所有 MUI 组件不需要 `"use client"` 即可使用，但使用了 hooks（如 `useMediaQuery`）的组件仍需标注。

### 过渡期并存

- Phase 1-7 期间 antd 和 MUI 同时运行，bundle 临时增大约 200-300 KB gzip，Phase 8 清除后恢复正常。
- 不要在单个 PR 中同时修改 2 个以上业务模块，每个模块单独 PR + Review。

### DateRangePicker 特别说明

`DateRangePicker` 属于 MUI X Pro（付费版）。若项目需要日期区间，可用两个独立的 `DatePicker`（start/end 各一个）替代，或评估是否购买 X Pro 许可证。

---

## 里程碑时间估算

| Phase | 内容 | 预计工时 | 累计工时 |
|-------|------|---------|---------|
| 0 | 准备与确认 | 0.5 天 | 0.5 天 |
| 1 | MUI 基础设施 | 1 天 | 1.5 天 |
| 2 | Layout Shell | 2 天 | 3.5 天 |
| 3 | 设计系统原语 | 1 天 | 4.5 天 |
| 4 | 列表页（16 个模块） | 4 天 | 8.5 天 |
| 5 | 表单 + Modal（17 个文件） | 3 天 | 11.5 天 |
| 6 | Timeline + 复杂组件（21 个文件） | 2 天 | 13.5 天 |
| 7 | 边缘模块 | 2 天 | 15.5 天 |
| 8 | 清理 + 验证 | 0.5 天 | **16 天** |

> 以上为 1 名开发者独立推进的估算。2 名开发者并行可压缩至 **10～12 个工作日**。

---

## 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| antd Form → react-hook-form 逻辑丢失 | 中 | 高 | 每个 Form 先阅读实现再迁移；`SchemaDynamicForm` 单独排期 |
| DataGrid 行 id 缺失导致 warning | 高 | 低 | 统一用 `getRowId` prop |
| Next.js App Router SSR FOUC | 低 | 中 | `AppRouterCacheProvider` 已处理 |
| MUI x-date-pickers RangePicker API 差异 | 中 | 中 | 提前 POC 验证；可用两个独立 DatePicker 替代 |
| react-hook-form 与 next-intl 表单校验消息 | 低 | 低 | zod schema 用 `t()` 函数生成消息字符串 |
