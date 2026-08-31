import type { MoneyAmountPresentation } from "@/lib/money/money-movement-amount";
import styles from "./MoneyAmountCell.module.css";

const TONE_CLASS: Record<MoneyAmountPresentation["tone"], string> = {
  inflow: styles.toneInflow,
  outflow: styles.toneOutflow,
  transfer: styles.toneTransfer,
  neutral: styles.toneNeutral,
};

export default function MoneyAmountCell({
  presentation,
}: {
  presentation: MoneyAmountPresentation;
}) {
  const { sign, amountBody, tone } = presentation;
  return (
    <span className={`financial-amount ${styles.amount} ${TONE_CLASS[tone]}`}>
      {sign ?? ""}
      {amountBody}
    </span>
  );
}
