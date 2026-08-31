"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import styles from "./PaymentPinInput.module.css";

const PIN_LENGTH = 6;

export interface PaymentPinInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function PaymentPinInput({
  value = "",
  onChange,
  disabled,
  ariaLabel = "Transaction password",
}: PaymentPinInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: PIN_LENGTH }, (_, index) => value[index] ?? "");

  const focusCell = (index: number) => {
    const input = inputsRef.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  };

  const commitDigits = (chars: string[], focusIndex?: number) => {
    const next = chars.join("").replace(/\D/g, "").slice(0, PIN_LENGTH);
    onChange?.(next);
    if (typeof focusIndex === "number") {
      focusCell(Math.min(focusIndex, PIN_LENGTH - 1));
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

    if (event.key === "ArrowRight" && index < PIN_LENGTH - 1) {
      event.preventDefault();
      focusCell(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (!pasted) {
      return;
    }
    const chars = pasted.split("");
    commitDigits(chars, pasted.length >= PIN_LENGTH ? PIN_LENGTH - 1 : pasted.length);
  };

  return (
    <div className={styles.pinGroup} role="group" aria-label={ariaLabel}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="password"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          className={`${styles.pinCell} financial-amount${digit ? ` ${styles.pinCellFilled}` : ""}`}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.currentTarget.select()}
        />
      ))}
    </div>
  );
}
