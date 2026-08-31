"use client";

import Link from "next/link";
import { Alert, Card, Col, Row, Space, Steps, Typography } from "antd";
import { ArrowLeftOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useLocale } from "next-intl";
import DashboardPage from "@/components/layout/DashboardPage";

const VERIFICATION_STEPS = [
    "从 HTTP Header 中读取 X-FilixPay-Signature 的值；",
    "获取原始请求 Body（注意：不能是已解析的 JSON 对象，必须是字符串）；",
    "使用您保存的 secret，对原始 Body 执行 HMAC-SHA256 运算；",
    "将结果转为小写十六进制字符串，并加上前缀 sha256=；",
    "与 Header 中的值进行安全比较（建议使用恒定时间比较函数，如 hmac.compare_digest）；",
    "若一致，则验签通过；否则拒绝该请求。",
];

const NOTES = [
    { title: "Body 必须原始", content: "任何格式化、排序、增删空格都会导致签名不匹配；" },
    { title: "Secret 保密", content: "请勿泄露或提交到代码仓库；" },
    { title: "重试请求签名不变", content: "同一事件的多次重试使用相同 payload 和 secret，签名值相同；" },
    { title: "大小写敏感", content: "签名必须为小写十六进制；" },
    { title: "不要关闭验签", content: "生产环境强制要求验签，无法关闭。" },
];

const COMMON_ERRORS = [
    "使用 JSON.parse(body).toString() 重新序列化 → ❌（会改变内容）",
    "忽略 UTF-8 编码 → ❌（非 UTF-8 会导致字节不一致）",
    "直接字符串比对（非恒定时间）→ ⚠️（存在时序攻击风险）",
];

export default function WebhookVerificationPage() {
    const locale = useLocale();

    return (
        <DashboardPage
            title="Webhook 签名验证说明"
            subtitle="了解如何验证来自 FilixPay 平台的 Webhook 请求签名"
            contentMode="table"
            extra={
                <Link href={`/${locale}/dashboard/developer`}>
                    <ArrowLeftOutlined /> Back to Developer Center
                </Link>
            }
        >
            <Alert
                type="info"
                showIcon
                icon={<SafetyCertificateOutlined />}
                message="为确保您收到的通知确实来自 FilixPay 平台，请务必对每个 Webhook 请求进行签名验证。我们采用 HMAC-SHA256 算法对请求体进行签名，并通过 HTTP Header 传递。"
                style={{ marginBottom: 24 }}
            />

            <Card title="1. 签名 Header 名称" style={{ marginBottom: 16 }}>
                <Typography.Paragraph type="secondary">
                    所有 Webhook 请求均包含以下 HTTP 头：
                </Typography.Paragraph>
                <Typography.Paragraph
                    style={{
                        marginBottom: 0,
                        fontFamily: "var(--font-mono)",
                        wordBreak: "break-all",
                    }}
                >
                    X-FilixPay-Signature: sha256=&lt;64位小写十六进制字符串&gt;
                </Typography.Paragraph>
                <Typography.Paragraph type="secondary" style={{ marginTop: 16 }}>
                    例如：
                </Typography.Paragraph>
                <Typography.Paragraph
                    style={{
                        marginBottom: 0,
                        fontFamily: "var(--font-mono)",
                        wordBreak: "break-all",
                    }}
                >
                    X-FilixPay-Signature:
                    sha256=5d3a7e8f1c9b2a0e4f6d8c7b3a1e9f2d0c4b8a6e2f1d5c9b3a7e0f4d8c2b6a1e
                </Typography.Paragraph>
            </Card>

            <Card title="2. 签名计算方式" style={{ marginBottom: 16 }}>
                <Typography.Paragraph type="secondary">签名由以下两部分生成：</Typography.Paragraph>
                <ul style={{ paddingLeft: 24, color: "#64748b" }}>
                    <li>
                        <strong>密钥（Key）：</strong>您在 FilixPay 商户后台配置 Webhook 时分配的
                        secret（每个 endpoint 唯一）
                    </li>
                    <li>
                        <strong>消息（Message）：</strong>HTTP 请求 Body 的原始 JSON
                        字符串（必须是未经任何处理的原始字节流，UTF-8 编码）
                    </li>
                </ul>
                <pre
                    style={{
                        background: "#1e293b",
                        color: "#f8fafc",
                        padding: 16,
                        borderRadius: 8,
                        overflow: "auto",
                    }}
                >
                    {`signature = HMAC-SHA256(key=your_webhook_secret, message=raw_request_body)
X-FilixPay-Signature = "sha256=" + hex(signature).toLowerCase()`}
                </pre>
            </Card>

            <Card title="3. 验签步骤" style={{ marginBottom: 16 }}>
                <Steps
                    direction="vertical"
                    size="small"
                    current={-1}
                    items={VERIFICATION_STEPS.map((step) => ({ title: step }))}
                />
            </Card>

            <Card title="4. 注意事项" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    {NOTES.map((item) => (
                        <Col key={item.title} xs={24} sm={12}>
                            <Card size="small" type="inner">
                                <Typography.Text strong>{item.title}</Typography.Text>
                                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                    {item.content}
                                </Typography.Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>

            <Card title="5. 常见错误" style={{ marginBottom: 16 }}>
                <Space direction="vertical">
                    {COMMON_ERRORS.map((error) => (
                        <Typography.Text key={error} type="secondary">
                            {error}
                        </Typography.Text>
                    ))}
                </Space>
            </Card>

            <Alert
                type="success"
                message="请严格按照上述规则实现验签逻辑，以保障您的系统安全。如有疑问，请联系 FilixPay 技术支持。"
            />
        </DashboardPage>
    );
}
