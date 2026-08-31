"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import styles from "./SetPaymentPasswordModal.module.css";

const OTP_LENGTH = 6;

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    masked?: boolean;
    variant?: "default" | "error";
    shake?: boolean;
    size?: "default" | "pin";
    ariaLabel?: string;
    idPrefix?: string;
}

export default function OtpInput({
    value,
    onChange,
    disabled,
    masked = false,
    variant = "default",
    shake = false,
    size = "default",
    ariaLabel = "One-time password",
    idPrefix = "otp",
}: OtpInputProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");

    const focusCell = (index: number) => {
        const input = inputsRef.current[index];
        if (input) {
            input.focus();
            input.select();
        }
    };

    const commitDigits = (chars: string[], focusIndex?: number) => {
        const next = chars.join("").replace(/\D/g, "").slice(0, OTP_LENGTH);
        onChange(next);
        if (typeof focusIndex === "number") {
            focusCell(Math.min(focusIndex, OTP_LENGTH - 1));
        }
    };

    const handleChange = (index: number, nextValue: string) => {
        const digit = nextValue.replace(/\D/g, "").slice(-1);
        const chars = [...digits];
        chars[index] = digit;
        commitDigits(chars, digit ? index + 1 : index);
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !digits[index] && index > 0) {
            event.preventDefault();
            const chars = [...digits];
            chars[index - 1] = "";
            commitDigits(chars, index - 1);
            return;
        }

        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            focusCell(index - 1);
        }

        if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            event.preventDefault();
            focusCell(index + 1);
        }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const chars = pasted.split("");
        commitDigits(chars, pasted.length >= OTP_LENGTH ? OTP_LENGTH - 1 : pasted.length);
    };

    const groupClass = [
        styles.otpGroup,
        size === "pin" ? styles.otpGroupPin : "",
        shake ? styles.otpGroupShake : "",
    ]
        .filter(Boolean)
        .join(" ");

    const cellClass = (digit: string) =>
        [
            styles.otpCell,
            size === "pin" ? styles.otpCellPin : "",
            digit ? styles.otpCellFilled : "",
            variant === "error" ? styles.otpCellError : "",
        ]
            .filter(Boolean)
            .join(" ");

    return (
        <div className={groupClass} role="group" aria-label={ariaLabel}>
            {digits.map((digit, index) => (
                <input
                    key={index}
                    id={`${idPrefix}-${index}`}
                    ref={(element) => {
                        inputsRef.current[index] = element;
                    }}
                    type={masked ? "password" : "text"}
                    inputMode="numeric"
                    autoComplete={
                        masked
                            ? index === 0
                                ? "new-password"
                                : "off"
                            : index === 0
                              ? "one-time-code"
                              : "off"
                    }
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    className={cellClass(digit)}
                    aria-label={`${ariaLabel} ${index + 1}`}
                    onChange={(event) => handleChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    onFocus={(event) => event.currentTarget.select()}
                />
            ))}
        </div>
    );
}
