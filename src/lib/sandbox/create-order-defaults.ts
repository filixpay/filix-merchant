export function buildDefaultCreateOrderInput(): Record<string, unknown> {
    const ts = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    return {
        merchantOrderId: `TEST${ts}`,
        subject: "接入验证测试订单",
        returnUrl: "https://merchant.example.com/return",
        totalAmount: { currency: "USD", amount: 10 },
        orderItems: [
            {
                productId: "TEST_PROD",
                productName: "测试商品",
                quantity: 1,
                unitPrice: 10,
            },
        ],
    };
}
