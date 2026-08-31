"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Form, Input, Select, Spin, message } from "antd";
import { ArrowRight, Bell, Edit3, Mail, Phone, Shield } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
    api,
    ApiError,
    CONTACT_TYPES,
    type ContactType,
    type MerchantContactView,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import styles from "./contact-page.module.css";

type ContactFormValues = {
    contactType: ContactType;
    value: string;
};

const PHONE_PREFIX_OTHER = "__OTHER__";

const PHONE_PREFIX_PRESETS = [
    { value: "+86", label: "🇨🇳 +86" },
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+44", label: "🇬🇧 +44" },
    { value: "+852", label: "🇭🇰 +852" },
] as const;

const PRESET_PREFIX_VALUES = new Set<string>(PHONE_PREFIX_PRESETS.map((item) => item.value));

const CONTACT_META: Record<
    ContactType,
    { icon: typeof Bell; overviewKey: "email" | "supportEmail" | "phone" }
> = {
    NOTIFICATION_EMAIL: { icon: Bell, overviewKey: "email" },
    SUPPORT_EMAIL: { icon: Mail, overviewKey: "supportEmail" },
    PHONE: { icon: Phone, overviewKey: "phone" },
};

function readContactValue(contacts: MerchantContactView, type: ContactType): string | null {
    const raw = contacts[CONTACT_META[type].overviewKey];
    const trimmed = raw?.trim();
    return trimmed || null;
}

function normalizeCustomPrefix(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

function resolvePrefixSelection(prefix: string): { selection: string; custom: string } {
    if (PRESET_PREFIX_VALUES.has(prefix)) {
        return { selection: prefix, custom: "" };
    }
    return { selection: PHONE_PREFIX_OTHER, custom: prefix };
}

function parsePhone(value: string | null | undefined): { prefix: string; number: string } {
    if (!value?.trim()) {
        return { prefix: "+86", number: "" };
    }
    const compact = value.trim().replace(/[\s-]/g, "");
    const plusMatch = compact.match(/^(\+\d{1,4})(\d{6,15})$/);
    if (plusMatch) {
        return { prefix: plusMatch[1], number: plusMatch[2] };
    }
    const chinaMatch = compact.match(/^86(1\d{10})$/);
    if (chinaMatch) {
        return { prefix: "+86", number: chinaMatch[1] };
    }
    const barePlus = compact.match(/^(\+\d{1,4})$/);
    if (barePlus) {
        return { prefix: barePlus[1], number: "" };
    }
    return { prefix: "+86", number: compact.replace(/^\+/, "") };
}

function fallbackContactsFromMerchant(detail: {
    email?: string;
    mobile?: string;
}): MerchantContactView {
    return {
        email: detail.email?.trim() || null,
        supportEmail: null,
        phone: detail.mobile?.trim() || null,
    };
}

export default function MaintenanceContactPage() {
    const t = useTranslations("Maintenance");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [loading, setLoading] = useState(false);
    const [contactsLoading, setContactsLoading] = useState(true);
    const [contactsError, setContactsError] = useState<string | null>(null);
    const [contacts, setContacts] = useState<MerchantContactView | null>(null);
    const [phonePrefixSelection, setPhonePrefixSelection] = useState("+86");
    const [customPhonePrefix, setCustomPhonePrefix] = useState("");
    const [form] = Form.useForm<ContactFormValues>();

    const contactTypeWatch = Form.useWatch("contactType", form) ?? "NOTIFICATION_EMAIL";
    const isPhone = contactTypeWatch === "PHONE";
    const isCustomPhonePrefix = phonePrefixSelection === PHONE_PREFIX_OTHER;
    const effectivePhonePrefix = isCustomPhonePrefix
        ? normalizeCustomPrefix(customPhonePrefix)
        : phonePrefixSelection;

    const currentValue = useMemo(
        () => (contacts ? readContactValue(contacts, contactTypeWatch) : null),
        [contacts, contactTypeWatch],
    );

    const loadContacts = useCallback(async () => {
        if (!accessToken) {
            setContactsLoading(false);
            return;
        }
        setContactsLoading(true);
        setContactsError(null);
        try {
            const data = await api.maintenance.getContact(accessToken);
            setContacts(data);
        } catch {
            try {
                const detail = await api.merchants.getDetail(accessToken);
                setContacts(fallbackContactsFromMerchant(detail));
            } catch (err) {
                setContactsError(err instanceof ApiError ? err.message : t("errors.generic"));
            }
        } finally {
            setContactsLoading(false);
        }
    }, [accessToken, t]);

    useEffect(() => {
        void loadContacts();
    }, [loadContacts]);

    useEffect(() => {
        form.setFieldValue("value", "");
        if (contactTypeWatch === "PHONE") {
            const phone = contacts ? readContactValue(contacts, "PHONE") : null;
            const parsed = parsePhone(phone);
            const resolved = resolvePrefixSelection(parsed.prefix);
            setPhonePrefixSelection(resolved.selection);
            setCustomPhonePrefix(resolved.custom);
        }
    }, [contactTypeWatch, contacts, form]);

    const handleSubmit = async (values: ContactFormValues) => {
        if (!accessToken) {
            signIn();
            return;
        }

        const payloadValue = isPhone
            ? `${effectivePhonePrefix} ${values.value.trim()}`.trim()
            : values.value.trim();

        if (isPhone) {
            if (!effectivePhonePrefix || !/^\+\d{1,4}$/.test(effectivePhonePrefix)) {
                message.error(t("validation.phonePrefixInvalid"));
                return;
            }
        }

        setLoading(true);
        try {
            await api.maintenance.updateContact(accessToken, {
                contactType: values.contactType,
                value: payloadValue,
            });
            message.success(t("contactSuccess"));
            form.resetFields(["value"]);
            await loadContacts();
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        } finally {
            setLoading(false);
        }
    };

    const renderOverviewCard = (type: ContactType) => {
        const { icon: Icon, overviewKey } = CONTACT_META[type];
        const raw = contacts?.[overviewKey]?.trim();
        const displayValue =
            type === "PHONE" && raw
                ? (() => {
                      const parsed = parsePhone(raw);
                      return parsed.number ? `${parsed.prefix} ${parsed.number}` : raw;
                  })()
                : raw;
        const bound = Boolean(raw);

        return (
            <div key={type} className={styles.overviewItem}>
                <div className={styles.overviewItemContent}>
                    <span className={styles.overviewItemHeader}>
                        <Icon size={12} aria-hidden />
                        {t(`contactType.${type}`)}
                    </span>
                    {bound ? (
                        <p className={styles.overviewItemValue}>{displayValue}</p>
                    ) : (
                        <p className={styles.overviewItemEmpty}>{t("contactNotSet")}</p>
                    )}
                </div>
                <span
                    className={`${styles.statusDot} ${bound ? styles.statusDotActive : styles.statusDotInactive}`}
                    aria-hidden
                />
            </div>
        );
    };

    return (
        <DashboardPage title={t("contactTitle")} subtitle={t("contactSubtitle")}>
            <div className={styles.page}>
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Shield size={16} className={styles.cardHeaderIcon} aria-hidden />
                        <h2 className={styles.cardTitle}>{t("contactOverviewTitle")}</h2>
                    </div>
                    <div className={styles.cardBody}>
                        {contactsLoading ? (
                            <div className={styles.loadingWrap}>
                                <Spin size="small" />
                            </div>
                        ) : contactsError ? (
                            <Alert type="error" showIcon message={contactsError} />
                        ) : (
                            <div className={styles.overviewGrid}>
                                {CONTACT_TYPES.map((type) => renderOverviewCard(type))}
                            </div>
                        )}
                    </div>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Edit3 size={16} className={styles.cardHeaderIconMuted} aria-hidden />
                        <h2 className={styles.cardTitle}>{t("contactUpdateTitle")}</h2>
                    </div>
                    <div className={styles.cardBody}>
                        <Form
                            form={form}
                            layout="vertical"
                            className={styles.form}
                            initialValues={{ contactType: "NOTIFICATION_EMAIL", value: "" }}
                            onFinish={(values) => void handleSubmit(values)}
                        >
                            <Form.Item name="contactType" hidden>
                                <Input type="hidden" />
                            </Form.Item>
                            <Form.Item label={t("contactTargetLabel")} required>
                                <div className={styles.typeGrid}>
                                    {CONTACT_TYPES.map((type) => {
                                        const Icon = CONTACT_META[type].icon;
                                        const active = contactTypeWatch === type;
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                className={`${styles.typeBtn}${active ? ` ${styles.typeBtnActive}` : ""}`}
                                                onClick={() => form.setFieldValue("contactType", type)}
                                            >
                                                <Icon size={14} aria-hidden />
                                                {t(`contactType.${type}`)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Form.Item>

                            <Form.Item
                                label={
                                    <div className={styles.valueLabelRow}>
                                        <span>
                                            {isPhone ? t("contactNewPhoneLabel") : t("contactNewEmailLabel")}
                                        </span>
                                        <span className={styles.currentHint}>
                                            {t("contactCurrentLabel")}:{" "}
                                            <span className={styles.currentHintValue}>
                                                {currentValue ?? t("contactNotSet")}
                                            </span>
                                        </span>
                                    </div>
                                }
                                required
                            >
                                {isPhone ? (
                                    <div className={styles.phoneRow}>
                                        <Select
                                            value={phonePrefixSelection}
                                            options={[
                                                ...PHONE_PREFIX_PRESETS.map((item) => ({
                                                    value: item.value,
                                                    label: item.label,
                                                })),
                                                {
                                                    value: PHONE_PREFIX_OTHER,
                                                    label: t("phonePrefixOther"),
                                                },
                                            ]}
                                            className={styles.phonePrefix}
                                            style={{ width: isCustomPhonePrefix ? 96 : 120 }}
                                            onChange={(value) => {
                                                setPhonePrefixSelection(value);
                                                if (value !== PHONE_PREFIX_OTHER) {
                                                    setCustomPhonePrefix("");
                                                }
                                            }}
                                        />
                                        {isCustomPhonePrefix ? (
                                            <Input
                                                value={customPhonePrefix}
                                                inputMode="tel"
                                                autoComplete="tel-country-code"
                                                placeholder={t("phonePrefixCustomPlaceholder")}
                                                className={styles.phoneCustomPrefix}
                                                onChange={(event) => {
                                                    const next = event.target.value
                                                        .replace(/[^\d+]/g, "")
                                                        .replace(/(?!^)\+/g, "")
                                                        .slice(0, 5);
                                                    setCustomPhonePrefix(next);
                                                }}
                                            />
                                        ) : null}
                                        <Form.Item
                                            name="value"
                                            noStyle
                                            rules={[
                                                { required: true, message: t("validation.required") },
                                                {
                                                    pattern: /^\d{6,15}$/,
                                                    message: t("validation.phoneInvalid"),
                                                },
                                            ]}
                                        >
                                            <Input
                                                inputMode="numeric"
                                                autoComplete="tel"
                                                placeholder={t("contactPhonePlaceholder")}
                                                className={styles.phoneInput}
                                            />
                                        </Form.Item>
                                    </div>
                                ) : (
                                    <div className={styles.emailField}>
                                        <Mail size={16} className={styles.emailIcon} aria-hidden />
                                        <Form.Item
                                            name="value"
                                            noStyle
                                            rules={[
                                                { required: true, message: t("validation.required") },
                                                {
                                                    type: "email",
                                                    message: t("validation.emailInvalid"),
                                                },
                                            ]}
                                        >
                                            <Input
                                                type="email"
                                                autoComplete="email"
                                                placeholder={
                                                    contactTypeWatch === "NOTIFICATION_EMAIL"
                                                        ? t("contactNotificationEmailPlaceholder")
                                                        : t("contactSupportEmailPlaceholder")
                                                }
                                                className={styles.emailInput}
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    className={styles.submitBtn}
                                    icon={<ArrowRight size={14} />}
                                    iconPosition="end"
                                >
                                    {t("contactSave")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        </DashboardPage>
    );
}
