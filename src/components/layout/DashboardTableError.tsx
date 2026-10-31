"use client";

import type { ReactNode } from "react";
import { Alert, Box, Button, Stack } from "@mui/material";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardTableErrorProps {
    description: ReactNode;
    onRetry?: () => void;
}

export default function DashboardTableError({ description, onRetry }: DashboardTableErrorProps) {
    const tCommon = useTranslations("Common");

    return (
        <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
            <Stack spacing={2} sx={{ alignItems: "center", maxWidth: 480, width: "100%" }}>
                <Alert severity="error" sx={{ width: "100%" }}>
                    {description}
                </Alert>
                {onRetry ? (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RefreshCw size={14} />}
                        onClick={onRetry}
                    >
                        {tCommon("refresh")}
                    </Button>
                ) : null}
            </Stack>
        </Box>
    );
}
