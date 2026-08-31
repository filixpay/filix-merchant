export type DashboardTableState =
    | "loading"
    | "error"
    | "empty"
    | "data"
    | "refresh-error";

export function resolveDashboardTableState({
    loading,
    error,
    rowCount,
}: {
    loading: boolean;
    error: unknown | null;
    rowCount: number;
}): DashboardTableState {
    if (loading && rowCount === 0) return "loading";
    if (error && rowCount === 0) return "error";
    if (error && rowCount > 0) return "refresh-error";
    if (rowCount === 0) return "empty";
    return "data";
}
