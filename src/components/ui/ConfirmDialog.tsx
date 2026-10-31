import type { ReactNode } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: "primary" | "error" | "warning" | "info" | "success" | "inherit";
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    title,
    content,
    confirmText = "确认",
    cancelText = "取消",
    confirmColor = "primary",
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {typeof content === "string" ? (
                    <DialogContentText>{content}</DialogContentText>
                ) : (
                    content
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} disabled={loading}>
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    color={confirmColor}
                    variant="contained"
                    disabled={loading}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
