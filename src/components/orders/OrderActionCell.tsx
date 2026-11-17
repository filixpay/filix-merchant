"use client";

import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { MoreHorizontal } from "lucide-react";
import styles from "./OrderListTable.module.css";

export type OrderRowAction = {
    key: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
};

interface OrderActionCellProps {
    actions: OrderRowAction[];
    actionLabel: string;
}

export function OrderActionCell({ actions, actionLabel }: OrderActionCellProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    if (actions.length === 0) {
        return <span className={styles.actionsEmpty}>-</span>;
    }

    const [primaryAction, ...overflowActions] = actions;

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleActionClick = (action: OrderRowAction) => {
        handleCloseMenu();
        action.onClick();
    };

    return (
        <div className={styles.actionsCell}>
            <button
                type="button"
                className={[
                    styles.actionLink,
                    primaryAction.key === "payment" ? styles.actionLinkPrimary : "",
                    primaryAction.danger ? styles.actionLinkDanger : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                onClick={primaryAction.onClick}
            >
                {primaryAction.label}
            </button>
            {overflowActions.length > 0 && (
                <>
                    <button
                        type="button"
                        className={styles.moreButton}
                        aria-label={actionLabel}
                        aria-controls={open ? "order-actions-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleOpenMenu}
                    >
                        <MoreHorizontal size={16} strokeWidth={2} />
                    </button>
                    <Menu
                        id="order-actions-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        slotProps={{
                            paper: {
                                sx: {
                                    minWidth: 150,
                                    borderRadius: 1.5,
                                    boxShadow:
                                        "0 4px 20px -2px rgba(0,0,0,0.12), 0 2px 6px -1px rgba(0,0,0,0.06)",
                                },
                            },
                        }}
                    >
                        {overflowActions.map((action) => (
                            <MenuItem
                                key={action.key}
                                onClick={() => handleActionClick(action)}
                                sx={{
                                    fontSize: 13,
                                    color: action.danger ? "error.main" : "text.primary",
                                    "&:hover": {
                                        bgcolor: action.danger ? "error.lighter" : "action.hover",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 26,
                                        color: action.danger ? "error.main" : "inherit",
                                    }}
                                >
                                    {action.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography sx={{ fontSize: 13 }}>{action.label}</Typography>}
                                />
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )}
        </div>
    );
}
