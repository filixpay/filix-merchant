"use client";

import Link from "next/link";
import { Typography } from "antd";
import styles from "./MoneyMovementIdCell.module.css";

type MoneyMovementIdCellProps = {
  value: string | null | undefined;
  /** When set, ID text navigates to detail; copy never navigates. */
  href?: string | null;
};

/**
 * Movement identity cell: monospace, truncated, copyable.
 * - Click ID (when href) → detail
 * - Click copy → copy only (stopPropagation so row click does not fire)
 */
export default function MoneyMovementIdCell({ value, href }: MoneyMovementIdCellProps) {
  if (!value) {
    return <Typography.Text type="secondary">—</Typography.Text>;
  }

  return (
    <span className={styles.cell}>
      {href ? (
        <Link
          href={href}
          className={styles.idLink}
          title={value}
          onClick={(event) => event.stopPropagation()}
        >
          {value}
        </Link>
      ) : (
        <Typography.Text className={styles.id} ellipsis={{ tooltip: value }}>
          {value}
        </Typography.Text>
      )}
      <span
        className={styles.copyWrap}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Typography.Text copyable={{ text: value, tooltips: false }} />
      </span>
    </span>
  );
}
