"use client";

import React, { useState } from "react";
import { Avatar, Menu, MenuItem, Divider, Box } from "@mui/material";
import { ChevronDown, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./layout.module.css";

type UserMenuProps = {
    email?: string | null;
    avatarLetter?: string;
    onLogout: () => void;
};

function emailLocalPart(email?: string | null): string {
    if (!email) {
        return "User";
    }
    const local = email.split("@")[0]?.trim();
    return local || email;
}

export default function UserMenu({ email, avatarLetter = "U", onLogout }: UserMenuProps) {
    const t = useTranslations("Layout");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogoutClick = () => {
        handleClose();
        onLogout();
    };

    return (
        <>
            <button
                type="button"
                className={styles.userMenuTrigger}
                aria-label={t("logout")}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <Avatar
                    sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "primary.main",
                        fontSize: 13,
                        fontWeight: 600,
                    }}
                >
                    {avatarLetter}
                </Avatar>
                <span className={styles.userMenuName}>{emailLocalPart(email)}</span>
                <ChevronDown size={12} strokeWidth={1.75} className={styles.userMenuChevron} />
            </button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            minWidth: 180,
                            borderRadius: "8px",
                            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.12)",
                            border: "1px solid #eef2f6",
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Box
                        sx={{
                            fontSize: 12,
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                        title={email ?? undefined}
                    >
                        {email ?? t("logout")}
                    </Box>
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                    onClick={handleLogoutClick}
                    sx={{
                        py: 1,
                        px: 2,
                        fontSize: 13,
                        color: "error.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        "&:hover": { bgcolor: "#fef2f2" },
                    }}
                >
                    <LogOut size={14} strokeWidth={1.75} />
                    <span>{t("logout")}</span>
                </MenuItem>
            </Menu>
        </>
    );
}
