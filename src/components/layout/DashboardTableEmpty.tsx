"use client";

import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { Inbox } from "lucide-react";

interface DashboardTableEmptyProps {
    description: ReactNode;
    action?: ReactNode;
}

export default function DashboardTableEmpty({ description, action }: DashboardTableEmptyProps) {
    return (
        <Box
            sx={{
                py: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "text.secondary",
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                    color: "#94a3b8",
                }}
            >
                <Inbox size={24} strokeWidth={1.5} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                {description}
            </Typography>
            {action && <Box sx={{ mt: 2 }}>{action}</Box>}
        </Box>
    );
}
