import { createTheme } from "@mui/material/styles";
import { zhCN } from "@mui/material/locale";

export const muiTheme = createTheme(
    {
        palette: {
            primary: {
                main: "#2563eb",
                light: "#3b82f6",
                dark: "#1d4ed8",
                contrastText: "#ffffff",
            },
            text: {
                primary: "#1e293b",
                secondary: "#64748b",
                disabled: "#94a3b8",
            },
            background: {
                default: "#ffffff",
                paper: "#ffffff",
            },
            divider: "#e2e8f0",
            error: { main: "#dc2626" },
            success: { main: "#16a34a" },
            warning: { main: "#d97706" },
        },
        typography: {
            fontFamily:
                "var(--font-geist-sans), var(--font-noto-sans-sc), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: 14,
            h1: { fontSize: 28, fontWeight: 600, lineHeight: 1.3 },
            h2: { fontSize: 22, fontWeight: 600, lineHeight: 1.35 },
            h3: { fontSize: 18, fontWeight: 600, lineHeight: 1.4 },
            h4: { fontSize: 15, fontWeight: 600, lineHeight: 1.45 },
            body1: { fontSize: 14, lineHeight: 1.65 },
            body2: { fontSize: 13, lineHeight: 1.6 },
            caption: { fontSize: 12, lineHeight: 1.5, color: "#64748b" },
        },
        shape: { borderRadius: 6 },
        spacing: 4, // 1 unit = 4px
        components: {
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        fontWeight: 500,
                        textTransform: "none",
                        height: 34,
                        paddingInline: 16,
                        fontSize: 13,
                    },
                    sizeSmall: { height: 28, fontSize: 12 },
                },
            },
            MuiTextField: {
                defaultProps: { size: "small", variant: "outlined" },
                styleOverrides: {
                    root: { "& .MuiInputBase-root": { height: 34 } },
                },
            },
            MuiSelect: { defaultProps: { size: "small" } },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        border: "1px solid #eef2f6",
                        boxShadow:
                            "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
                    },
                },
            },
            MuiDialog: {
                styleOverrides: { paper: { borderRadius: 10 } },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontSize: 12, height: 22, borderRadius: 4 },
                },
            },
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        "& .MuiTableCell-root": {
                            backgroundColor: "#ffffff",
                            color: "#64748b",
                            fontWeight: 500,
                            fontSize: 12,
                            borderBottom: "1px solid #e2e8f0",
                            padding: "10px 16px",
                            whiteSpace: "nowrap",
                        },
                    },
                },
            },
            MuiTableBody: {
                styleOverrides: {
                    root: {
                        "& .MuiTableCell-root": {
                            fontSize: 13,
                            color: "#1e293b",
                            borderBottom: "1px solid #f1f5f9",
                            padding: "12px 16px",
                        },
                        "& .MuiTableRow-root:hover .MuiTableCell-root": {
                            backgroundColor: "#f8fafc",
                        },
                        "& .MuiTableRow-root:last-child .MuiTableCell-root": {
                            borderBottom: "none",
                        },
                    },
                },
            },
            MuiPagination: {
                styleOverrides: {
                    root: { padding: "12px 16px", borderTop: "1px solid #f1f5f9" },
                },
            },
        },
    },
    zhCN,
);
