"use client";

import React from "react";
import Link from "next/link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { DashboardMenuItem } from "./dashboard-menu";
import { localizedHref } from "./dashboard-menu";

interface MuiSidebarNavProps {
    items: DashboardMenuItem[];
    locale: string;
    selectedKey: string;
    openKeys: string[];
    onOpenChange: (keys: string[]) => void;
    onNavigate: () => void;
    isCollapsed: boolean;
}

export function MuiSidebarNav({
    items,
    locale,
    selectedKey,
    openKeys,
    onOpenChange,
    onNavigate,
    isCollapsed,
}: MuiSidebarNavProps) {
    const handleToggleSubmenu = (key: string) => {
        if (openKeys.includes(key)) {
            onOpenChange(openKeys.filter((k) => k !== key));
        } else {
            onOpenChange([...openKeys, key]);
        }
    };

    return (
        <List
            dense
            disablePadding
            sx={{
                width: "100%",
                py: 0.5,
                px: 1,
            }}
        >
            {items
                .filter((item) => item.visible !== false)
                .map((item) => (
                    <MuiNavItem
                        key={item.key}
                        item={item}
                        locale={locale}
                        selectedKey={selectedKey}
                        openKeys={openKeys}
                        onToggleSubmenu={handleToggleSubmenu}
                        onNavigate={onNavigate}
                        isCollapsed={isCollapsed}
                        level={0}
                    />
                ))}
        </List>
    );
}

interface MuiNavItemProps {
    item: DashboardMenuItem;
    locale: string;
    selectedKey: string;
    openKeys: string[];
    onToggleSubmenu: (key: string) => void;
    onNavigate: () => void;
    isCollapsed: boolean;
    level: number;
}

function MuiNavItem({
    item,
    locale,
    selectedKey,
    openKeys,
    onToggleSubmenu,
    onNavigate,
    isCollapsed,
    level,
}: MuiNavItemProps) {
    const hasChildren = item.children && item.children.length > 0;
    const href = item.href ? localizedHref(locale, item.href) : "";
    const isSelected = !hasChildren && href === selectedKey;
    const isOpen = openKeys.includes(item.key);
    const Icon = item.icon;

    if (hasChildren) {
        if (isCollapsed) {
            return (
                <Tooltip title={item.label} placement="right" arrow>
                    <ListItemButton
                        onClick={() => onToggleSubmenu(item.key)}
                        sx={{
                            minHeight: 36,
                            justifyContent: "center",
                            px: 1,
                            my: 0.25,
                            borderRadius: 1.5,
                            color: "#64748b",
                            "&:hover": {
                                bgcolor: "#f1f5f9",
                                color: "#0f172a",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                justifyContent: "center",
                                color: "inherit",
                            }}
                        >
                            <Icon size={18} strokeWidth={1.75} />
                        </ListItemIcon>
                    </ListItemButton>
                </Tooltip>
            );
        }

        return (
            <React.Fragment>
                <ListItemButton
                    onClick={() => onToggleSubmenu(item.key)}
                    sx={{
                        minHeight: 32,
                        py: 0.5,
                        px: 1.25,
                        my: 0.25,
                        borderRadius: 1.5,
                        color: isOpen ? "#475569" : "#64748b",
                        bgcolor: isOpen ? "#f8fafc" : "transparent",
                        fontSize: 13,
                        "&:hover": {
                            bgcolor: "#f1f5f9",
                            color: "#0f172a",
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 28,
                            color: "inherit",
                        }}
                    >
                        <Icon size={16} strokeWidth={1.75} />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: "20px" }}>
                                {item.label}
                            </Typography>
                        }
                    />
                    {isOpen ? (
                        <ChevronDown size={14} strokeWidth={1.75} />
                    ) : (
                        <ChevronRight size={14} strokeWidth={1.75} />
                    )}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List dense disablePadding sx={{ pl: 2 }}>
                        {item.children!
                            .filter((child) => child.visible !== false)
                            .map((child) => (
                                <MuiNavItem
                                    key={child.key}
                                    item={child}
                                    locale={locale}
                                    selectedKey={selectedKey}
                                    openKeys={openKeys}
                                    onToggleSubmenu={onToggleSubmenu}
                                    onNavigate={onNavigate}
                                    isCollapsed={isCollapsed}
                                    level={level + 1}
                                />
                            ))}
                    </List>
                </Collapse>
            </React.Fragment>
        );
    }

    const buttonContent = (
        <ListItemButton
            component={Link}
            href={href}
            onClick={onNavigate}
            selected={isSelected}
            sx={{
                minHeight: 32,
                py: 0.5,
                px: isCollapsed ? 1 : 1.25,
                my: 0.25,
                borderRadius: 1.5,
                justifyContent: isCollapsed ? "center" : "flex-start",
                color: isSelected ? "#2563eb" : "#64748b",
                bgcolor: isSelected ? "#eff6ff !important" : "transparent",
                position: "relative",
                "&:hover": {
                    bgcolor: isSelected ? "#eff6ff" : "#f1f5f9",
                    color: isSelected ? "#2563eb" : "#0f172a",
                },
                ...(isSelected && {
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: 16,
                        bgcolor: "#2563eb",
                        borderRadius: "0 4px 4px 0",
                    },
                }),
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: isCollapsed ? 0 : 28,
                    justifyContent: "center",
                    color: isSelected ? "#2563eb" : "inherit",
                }}
            >
                <Icon size={isCollapsed ? 18 : 16} strokeWidth={1.75} />
            </ListItemIcon>
            {!isCollapsed && (
                <ListItemText
                    primary={
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: isSelected ? 600 : 500,
                                lineHeight: "20px",
                            }}
                        >
                            {item.label}
                        </Typography>
                    }
                />
            )}
        </ListItemButton>
    );

    if (isCollapsed) {
        return (
            <Tooltip title={item.label} placement="right" arrow>
                {buttonContent}
            </Tooltip>
        );
    }

    return buttonContent;
}
