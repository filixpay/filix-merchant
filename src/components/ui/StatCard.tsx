import type { ReactNode } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

export interface StatCardProps {
    title: string;
    value: string | number;
    suffix?: string;
    extra?: ReactNode;
}

export function StatCard({ title, value, suffix, extra }: StatCardProps) {
    return (
        <Card>
            <CardContent>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1 }}
                >
                    {title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
                    >
                        {value}
                    </Typography>
                    {suffix && (
                        <Typography variant="body2" color="text.secondary">
                            {suffix}
                        </Typography>
                    )}
                </Box>
                {extra}
            </CardContent>
        </Card>
    );
}
