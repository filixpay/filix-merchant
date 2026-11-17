"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
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

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        onLogout();
    };

    return (
        <>
            <button
                type="button"
                className={styles.userMenuTrigger}
                aria-label={t("logout")}
                aria-controls={open ? "user-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <Avatar
                    sx={{
                        width: 28,
                        height: 28,
                        fontSize: 13,
                        bgcolor: "primary.main",
                        fontWeight: 600,
                    }}
                >
                    {avatarLetter}
                </Avatar>
                <span className={styles.userMenuName}>{emailLocalPart(email)}</span>
                <ChevronDown size={12} strokeWidth={1.75} className={styles.userMenuChevron} />
            </button>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            minWidth: 180,
                            borderRadius: 1.5,
                            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.12), 0 2px 6px -1px rgba(0,0,0,0.06)",
                        },
                    },
                }}
            >
                <MenuItem disabled sx={{ opacity: "1 !important", py: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            fontSize: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 200,
                        }}
                        title={email ?? undefined}
                    >
                        {email ?? t("logout")}
                    </Typography>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        color: "error.main",
                        fontSize: 13,
                        gap: 1.5,
                        "&:hover": { bgcolor: "error.lighter", color: "error.dark" },
                    }}
                >
                    <LogOut size={14} strokeWidth={1.75} />
                    {t("logout")}
                </MenuItem>
            </Menu>
        </>
    );
}
