"use client";

import { Button, List, QRCode, Space, Tag, Typography, message } from "antd";
import type { WalletAddressView } from "@/lib/api/domains/wallet-reads";

interface Props {
  assetCode: string;
  network: string;
  addresses: WalletAddressView[];
  loading?: boolean;
}

export default function WalletAddressesPanel({
  assetCode,
  network,
  addresses,
  loading,
}: Props) {
  if (loading) {
    return <Typography.Text type="secondary">Loading addresses…</Typography.Text>;
  }
  if (addresses.length === 0) {
    return (
      <Typography.Text type="secondary">
        No addresses for {assetCode} / {network}
      </Typography.Text>
    );
  }

  return (
    <List
      size="small"
      header={
        <Typography.Text strong>
          {assetCode} · {network} addresses
        </Typography.Text>
      }
      dataSource={addresses}
      renderItem={(item) => (
        <List.Item>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <Space wrap>
              <Tag>{item.purpose}</Tag>
              <Tag color={item.status === "ACTIVE" ? "green" : "default"}>{item.status}</Tag>
              <Tag>{item.custodyType}</Tag>
            </Space>
            <Typography.Paragraph copyable={item.operations.copy ? { text: item.address } : false} style={{ marginBottom: 0 }}>
              {item.address}
            </Typography.Paragraph>
            <Space>
              {item.operations.copy ? (
                <Button
                  size="small"
                  onClick={async () => {
                    await navigator.clipboard.writeText(item.address);
                    message.success("Copied");
                  }}
                >
                  Copy
                </Button>
              ) : null}
              {item.operations.qr ? <QRCode value={item.address} size={96} /> : null}
            </Space>
          </Space>
        </List.Item>
      )}
    />
  );
}
