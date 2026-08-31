import dayjs, { type Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import type { SettlementPeriodKind } from "@/lib/settlement-statements/api";

dayjs.extend(isoWeek);

/** ISO week-based year + Wxx — matches backend WeekFields.ISO. */
export function formatIsoWeekPeriodKey(value: Dayjs): string {
  const year = value.isoWeekYear();
  const week = String(value.isoWeek()).padStart(2, "0");
  return `${year}-W${week}`;
}

export function formatPeriodKey(value: Dayjs, periodKind: SettlementPeriodKind): string {
  switch (periodKind) {
    case "WEEK":
      return formatIsoWeekPeriodKey(value);
    case "MONTH":
      return value.format("YYYY-MM");
    default:
      return value.format("YYYY-MM-DD");
  }
}

export function defaultPeriodRange(periodKind: SettlementPeriodKind): [Dayjs, Dayjs] {
  const end = dayjs();
  switch (periodKind) {
    case "WEEK":
      return [end.subtract(7, "week").startOf("isoWeek"), end.startOf("isoWeek")];
    case "MONTH":
      return [end.subtract(5, "month").startOf("month"), end.startOf("month")];
    default:
      return [end.subtract(13, "day").startOf("day"), end.startOf("day")];
  }
}
