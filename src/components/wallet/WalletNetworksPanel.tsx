"use client";

import { Button, List, Space, Tag, Typography } from "antd";
import type { WalletNetworkView } from "@/lib/api/domains/wallet-reads";

interface Props {
  assetCode: string;
  networks: WalletNetworkView[];
  loading?: boolean;
  selectedNetwork: string | null;
  onSelectNetwork: (network: string) => void;
}

export default function WalletNetworksPanel({
  assetCode,
  networks,
  loading,
  selectedNetwork,
  onSelectNetwork,
}: Props) {
  if (loading) {
    return <Typography.Text type="secondary">Loading networks…</Typography.Text>;
  }
  if (networks.length === 0) {
    return (
      <Typography.Text type="secondary">
        No networks for {assetCode}
      </Typography.Text>
    );
  }
  return (
    <List
      size="small"
      header={<Typography.Text strong>{assetCode} networks</Typography.Text>}
      dataSource={networks}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button
              key="open"
              type={selectedNetwork === item.network ? "primary" : "link"}
              size="small"
              disabled={!item.enabled && item.collectionAddressCount === 0}
              onClick={() => onSelectNetwork(item.network)}
            >
              Addresses
            </Button>,
          ]}
        >
          <Space>
            <Tag color={item.enabled ? "green" : "default"}>
              {item.enabled ? "Enabled" : "Disabled"}
            </Tag>
            <Typography.Text>{item.network}</Typography.Text>
            <Typography.Text type="secondary">
              {item.collectionAddressCount} address
              {item.collectionAddressCount === 1 ? "" : "es"}
            </Typography.Text>
          </Space>
        </List.Item>
      )}
    />
  );
}
