"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
                    color: "#94a3b8",
                    mb: 1.5,
                }}
            >
                <Inbox size={24} />
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: 13 }}>
                {description}
            </Typography>
            {action && <Box sx={{ mt: 2 }}>{action}</Box>}
        </Box>
    );
}
