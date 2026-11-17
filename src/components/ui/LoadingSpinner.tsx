import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

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
