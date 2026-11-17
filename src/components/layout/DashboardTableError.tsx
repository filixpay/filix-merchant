"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardTableErrorProps {
    description: ReactNode;
    onRetry?: () => void;
}

export default function DashboardTableError({ description, onRetry }: DashboardTableErrorProps) {
    const tCommon = useTranslations("Common");

    return (
        <Box
            sx={{
                py: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 1.5,
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#fef2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ef4444",
                }}
            >
                <AlertCircle size={24} />
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: 13, maxWidth: 400 }}>
                {description}
            </Typography>
            {onRetry ? (
                <Button variant="outlined" size="small" onClick={onRetry} sx={{ mt: 1 }}>
                    {tCommon("refresh")}
                </Button>
            ) : null}
        </Box>
    );
}
