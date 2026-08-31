import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import MoneyAssetLabel from "@/components/money/MoneyAssetLabel";
import styles from "./DashboardCurrencyRow.module.css";

type DashboardCurrencyRowProps = {
  assetCode: string;
  /** Decimal amount string, e.g. "12.00" */
  amount: string;
  locale?: string;
};

export default function DashboardCurrencyRow({
  assetCode,
  amount,
  locale = "en-US",
}: DashboardCurrencyRowProps) {
  const parts = formatWalletAmountDisplay(amount, assetCode, locale);

  return (
    <div className={styles.row}>
      <MoneyAssetLabel assetCode={assetCode} compact />
      <div className={`${styles.amount} financial-amount`}>
        {parts.symbol ? <span className={styles.symbol}>{parts.symbol}</span> : null}
        <span className={styles.value}>{parts.amount}</span>
        <span className={styles.code}>{parts.assetCode}</span>
      </div>
    </div>
  );
}
