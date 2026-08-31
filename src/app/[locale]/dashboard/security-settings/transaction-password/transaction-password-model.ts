export function hasWeakPinPattern(pin: string): boolean {
    if (pin.length !== 6) {
        return false;
    }
    const isSequential =
        /^(012345|123456|234567|345678|456789|567890|098765|987654|876543|765432|654321|543210)$/.test(
            pin,
        );
    const isRepeating = /^(.)\1{5}$/.test(pin);
    return isSequential || isRepeating;
}

export function isPinCompleteAndValid(pin: string): boolean {
    return pin.length === 6 && !hasWeakPinPattern(pin);
}

export type PasswordStrength = "none" | "weak" | "medium" | "strong";

export function getPasswordStrength(pwd: string): PasswordStrength {
    if (!pwd) return "none";
    if (pwd.length < 6) return "weak";
    const isSequential =
        /^(012345|123456|234567|345678|456789|567890|098765|987654|876543|765432|654321|543210)$/.test(
            pwd,
        );
    const isRepeating = /^(.)\1{5}$/.test(pwd);
    if (isSequential || isRepeating) return "weak";
    const uniqueDigits = new Set(pwd.split("")).size;
    if (uniqueDigits <= 2) return "weak";
    if (uniqueDigits <= 4) return "medium";
    return "strong";
}

export function getStrengthPercent(strength: PasswordStrength): number {
    if (strength === "weak") return 33;
    if (strength === "medium") return 66;
    if (strength === "strong") return 100;
    return 0;
}

export function getStrengthStatus(
    strength: PasswordStrength,
): "exception" | "normal" | "success" | undefined {
    if (strength === "weak") return "exception";
    if (strength === "medium") return "normal";
    if (strength === "strong") return "success";
    return undefined;
}

export function maskEmail(email: string): string {
    return email.replace(
        /^(.{2})(.*)(@.*)$/,
        (_: string, start: string, mid: string, end: string) =>
            start + "•".repeat(Math.min(mid.length, 6)) + end,
    );
}
