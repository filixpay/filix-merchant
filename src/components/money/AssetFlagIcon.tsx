import { getCurrencyFlagPath } from "@/lib/money/currency-flag-codes";
import styles from "./AssetFlagIcon.module.css";

type AssetFlagIconProps = {
  assetCode: string;
  className?: string;
  size?: number;
};

export default function AssetFlagIcon({ assetCode, className, size = 28 }: AssetFlagIconProps) {
  const flagPath = getCurrencyFlagPath(assetCode);
  const rootClassName = [styles.flag, className].filter(Boolean).join(" ");

  if (!flagPath) {
    return (
      <span className={`${rootClassName} ${styles.fallback}`} aria-hidden>
        <span className={styles.fallbackText}>{assetCode.slice(0, 2).toUpperCase()}</span>
      </span>
    );
  }

  return (
    <span className={rootClassName} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flagPath}
        alt=""
        width={size}
        height={size}
        className={styles.image}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
