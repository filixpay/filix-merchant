import { Box, CircularProgress, Typography } from "@mui/material";

export function LoadingSpinner({ tip }: { tip?: string }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 200,
                gap: 2,
            }}
        >
            <CircularProgress size={32} />
            {tip && (
                <Typography variant="body2" color="text.secondary">
                    {tip}
                </Typography>
            )}
        </Box>
    );
}
