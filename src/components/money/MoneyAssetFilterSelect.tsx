"use client";

import { Select, Typography } from "antd";
import MoneyAssetLabel from "@/components/money/MoneyAssetLabel";
import {
  assetFilterFromSelectValue,
  buildAssetFilterSelectOptions,
  MONEY_ASSET_FILTER_ALL,
  selectValueFromAssetFilter,
} from "@/lib/money/asset-filter";
import styles from "./MoneyAssetFilterSelect.module.css";

interface MoneyAssetFilterSelectProps {
  label: string;
  allLabel: string;
  assetOptions: string[];
  value: string | null;
  loading?: boolean;
  onChange: (assetCode: string | null) => void;
}

export default function MoneyAssetFilterSelect({
  label,
  allLabel,
  assetOptions,
  value,
  loading = false,
  onChange,
}: MoneyAssetFilterSelectProps) {
  const options = buildAssetFilterSelectOptions(assetOptions, allLabel);

  return (
    <>
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Select
        className={styles.select}
        loading={loading}
        disabled={loading || assetOptions.length === 0}
        value={selectValueFromAssetFilter(value)}
        options={options}
        onChange={(next: string) => onChange(assetFilterFromSelectValue(next))}
        aria-label={label}
        optionRender={(option) => {
          if (option.value === MONEY_ASSET_FILTER_ALL) {
            return <span className={styles.allOption}>{allLabel}</span>;
          }
          return <MoneyAssetLabel assetCode={String(option.value ?? "")} compact />;
        }}
        labelRender={(props) => {
          if (props.value === MONEY_ASSET_FILTER_ALL) {
            return <span className={styles.allOption}>{allLabel}</span>;
          }
          return <MoneyAssetLabel assetCode={String(props.value ?? "")} compact />;
        }}
      />
    </>
  );
}
