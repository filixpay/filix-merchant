import type { ReactNode } from "react";
import { Grid, Typography } from "@mui/material";

export interface DescriptionItem {
    label: string;
    value: ReactNode;
    span?: number;
}

export function DescriptionGrid({
    items,
    columns = 2,
}: {
    items: DescriptionItem[];
    columns?: number;
}) {
    return (
        <Grid container spacing={2}>
            {items.map(({ label, value, span = 1 }, i) => (
                <Grid size={{ xs: 12, sm: Math.min(12, (12 / columns) * span) }} key={i}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {label}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                        {value ?? "—"}
                    </Typography>
                </Grid>
            ))}
        </Grid>
    );
}
