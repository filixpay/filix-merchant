import AssetFlagIcon from "@/components/money/AssetFlagIcon";
import styles from "./MoneyAssetLabel.module.css";

type MoneyAssetLabelProps = {
  assetCode: string;
  accountLabel?: string;
  compact?: boolean;
};

export default function MoneyAssetLabel({
  assetCode,
  accountLabel,
  compact = false,
}: MoneyAssetLabelProps) {
  return (
    <span className={`${styles.root} ${compact ? styles.compact : ""}`}>
      <AssetFlagIcon assetCode={assetCode} className={styles.flag} size={20} />
      <span className={styles.code}>{assetCode}</span>
      {accountLabel ? <span className={styles.account}>{accountLabel}</span> : null}
    </span>
  );
}
