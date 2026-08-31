"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Alert, Button, Form, Input, Radio, Select, Spin, Tooltip } from "antd";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Coins,
  CreditCard,
  HelpCircle,
  Mail,
  Network,
  ShieldCheck,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import {
  membershipStateFromOrganizations,
  shouldRedirectCreateMerchantToDashboard,
} from "@/lib/auth/merchant-context-resolver";
import {
  composeTrialMobile,
  mapTrialCreateError,
  normalizePhonePrefix,
  validateTrialMerchantForm,
  type TrialMerchantFormValues,
} from "@/lib/onboarding/trial-merchant-form";
import {
  SETTLEMENT_CURRENCY_OPTIONS,
  formatSettlementCurrencyLabel,
} from "@/lib/onboarding/settlement-currency";
import { activateTrialWorkspace } from "@/lib/onboarding/activate-trial-workspace";
import {
  classifyPortalApiAuthError,
  shouldReauthOnPortalApiError,
} from "@/lib/onboarding/portal-api-auth-error";
import {
  persistOrganizationSelection,
  writeOrganizationsCache,
} from "@/components/layout/organization-shell";
import { setStoredSelectedMerchantCode } from "@/lib/merchant/selected-merchant-code";
import styles from "./create-merchant.module.css";

const PHONE_PREFIX_OTHER = "__OTHER__";

const PHONE_PREFIX_PRESETS = [
  { value: "+86", label: "🇨🇳 +86" },
  { value: "+1", label: "🇺🇸 +1" },
  { value: "+44", label: "🇬🇧 +44" },
  { value: "+852", label: "🇭🇰 +852" },
] as const;

type FormValues = TrialMerchantFormValues;

export default function CreateMerchantPage() {
  const t = useTranslations("FirstOnboarding");
  const locale = useLocale();
  const router = useRouter();
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const email = (session?.user?.email as string | undefined) ?? "";

  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsErrorKey, setOrgsErrorKey] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [membershipNotReady, setMembershipNotReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phonePrefixSelection, setPhonePrefixSelection] = useState("+86");
  const [customPhonePrefix, setCustomPhonePrefix] = useState("");
  const [form] = Form.useForm<FormValues>();

  const isCustomPhonePrefix = phonePrefixSelection === PHONE_PREFIX_OTHER;
  const effectivePhonePrefix = isCustomPhonePrefix
    ? normalizePhonePrefix(customPhonePrefix)
    : phonePrefixSelection;

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn("keycloak", {
        callbackUrl: `/${locale}/onboarding/create-merchant`,
      });
    }
  }, [status, locale]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      setOrgsLoading(true);
      setOrgsErrorKey(null);
      try {
        const orgs = await api.organizations.list(accessToken);
        if (cancelled) return;
        const state = membershipStateFromOrganizations(orgs);
        if (shouldRedirectCreateMerchantToDashboard(state, false)) {
          router.replace(`/${locale}/dashboard`);
        }
      } catch (err) {
        if (cancelled) return;
        const authKind = classifyPortalApiAuthError(err, true);
        setOrgsErrorKey(
          authKind === "portal_rejected"
            ? "errors.portalAuthRejected"
            : "errors.orgsLoadFailed",
        );
      } finally {
        if (!cancelled) setOrgsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, locale, router]);

  const emailReadonly = useMemo(() => email, [email]);

  const onFinish = async (values: FormValues) => {
    if (!accessToken) return;
    setBanner(null);
    setMembershipNotReady(false);
    const fieldErrors = validateTrialMerchantForm({
      ...values,
      phonePrefix: effectivePhonePrefix,
    });
    if (Object.keys(fieldErrors).length) {
      form.setFields(
        Object.entries(fieldErrors).map(([name, key]) => ({
          name: name as keyof FormValues,
          errors: [t(key as "errors.nameRequired")],
        })),
      );
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.merchants.create(
        {
          name: values.name.trim(),
          mobile: composeTrialMobile(effectivePhonePrefix, values.mobile),
          officialIdNumber: values.officialIdNumber.trim(),
          email: emailReadonly,
          settlementMode: values.settlementMode,
          settlementCurrency: values.settlementCurrency.trim(),
        },
        accessToken,
      );
      try {
        await activateTrialWorkspace(accessToken, created.merchantCode, {
          listOrganizations: (token) => api.organizations.list(token),
          listMerchants: (token) => api.organizations.listMerchants(token),
          persistOrganization: persistOrganizationSelection,
          persistMerchantCode: setStoredSelectedMerchantCode,
          writeCache: writeOrganizationsCache,
        });
        router.replace(`/${locale}/dashboard`);
      } catch {
        setMembershipNotReady(true);
        setBanner(t("errors.membershipNotReady"));
      }
    } catch (err) {
      const mapped = mapTrialCreateError(
        err instanceof ApiError
          ? { status: err.status, code: err.code, message: err.message, data: err.data }
          : { status: 500, message: "error" },
      );
      if (mapped.kind === "already_has_merchant") {
        router.replace(`/${locale}/dashboard`);
        return;
      }
      if (mapped.kind === "unauthorized") {
        const authKind = classifyPortalApiAuthError(
          err instanceof ApiError ? err : new ApiError("unauthorized", 401),
          status === "authenticated" && Boolean(accessToken),
        );
        if (shouldReauthOnPortalApiError(authKind)) {
          void signIn("keycloak", {
            callbackUrl: `/${locale}/onboarding/create-merchant`,
          });
        } else {
          setBanner(t("errors.portalAuthRejected"));
        }
        return;
      }
      if (mapped.kind === "field" && mapped.field) {
        form.setFields([
          { name: mapped.field, errors: [t(mapped.messageKey as "errors.duplicateName")] },
        ]);
      } else {
        setBanner(t(mapped.messageKey as "errors.createFailed"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || orgsLoading) {
    return (
      <div className={styles.centerState}>
        <Spin />
      </div>
    );
  }

  if (orgsErrorKey) {
    return (
      <div className={styles.centerState}>
        <div className={styles.errorCard}>
          <Alert type="error" message={t(orgsErrorKey as "errors.orgsLoadFailed")} showIcon />
          <div className={styles.errorActions}>
            <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
            <Button
              type="primary"
              onClick={() =>
                void signIn("keycloak", {
                  callbackUrl: `/${locale}/onboarding/create-merchant`,
                })
              }
            >
              {t("relogin")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.banner}>
          <div className={styles.bannerEyebrow}>
            <ShieldCheck size={16} strokeWidth={2} />
            {t("eyebrow")}
          </div>
          <h1 className={styles.bannerTitle}>{t("title")}</h1>
          <p className={styles.bannerSubtitle}>{t("subtitle")}</p>
        </header>

        <div className={styles.body}>
          {banner ? (
            <Alert type="error" showIcon message={banner} className={styles.bannerAlert} />
          ) : null}
          {membershipNotReady ? (
            <Button
              className={styles.reloginBtn}
              onClick={() =>
                void signIn("keycloak", { callbackUrl: `/${locale}/dashboard` })
              }
            >
              {t("relogin")}
            </Button>
          ) : null}

          <div className={styles.accountCard}>
            <div className={styles.accountMain}>
              <div className={styles.accountIcon} aria-hidden>
                <Mail size={16} strokeWidth={2} />
              </div>
              <div>
                <span className={styles.accountLabel}>{t("fields.currentAccount")}</span>
                <span className={styles.accountValue}>
                  {emailReadonly || t("fields.emailUnavailable")}
                </span>
              </div>
            </div>
            {emailReadonly ? (
              <span className={styles.verifiedTag}>{t("fields.verified")}</span>
            ) : null}
          </div>

          <Form
            form={form}
            layout="vertical"
            className={styles.form}
            onFinish={(values) => void onFinish(values)}
            disabled={submitting}
            initialValues={{ settlementMode: "PLATFORM", settlementCurrency: "USD" }}
          >
            <div className={styles.grid}>
              <div className={styles.fullWidth}>
                <Form.Item
                  name="name"
                  label={
                    <span>
                      {t("fields.name")} <span className={styles.required}>*</span>
                    </span>
                  }
                  rules={[{ required: true, message: t("errors.nameRequired") }]}
                >
                  <Input
                    maxLength={200}
                    placeholder={t("fields.namePlaceholder")}
                    className={styles.textInput}
                    prefix={<Building2 size={16} className={styles.prefixIcon} aria-hidden />}
                  />
                </Form.Item>
              </div>

              <div className={styles.fullWidth}>
                <Form.Item
                  label={
                    <span>
                      {t("fields.mobile")} <span className={styles.required}>*</span>
                    </span>
                  }
                  required
                  style={{ marginBottom: 0 }}
                >
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
                          label: t("fields.phonePrefixOther"),
                        },
                      ]}
                      className={styles.phonePrefix}
                      style={{ width: isCustomPhonePrefix ? 96 : 120 }}
                      popupMatchSelectWidth={false}
                      onChange={(value) => {
                        setPhonePrefixSelection(value);
                        if (value !== PHONE_PREFIX_OTHER) {
                          setCustomPhonePrefix("");
                        }
                        form.setFields([{ name: "mobile", errors: [] }]);
                      }}
                      disabled={submitting}
                    />
                    {isCustomPhonePrefix ? (
                      <Input
                        value={customPhonePrefix}
                        inputMode="tel"
                        autoComplete="tel-country-code"
                        placeholder={t("fields.phonePrefixCustomPlaceholder")}
                        className={styles.phoneCustomPrefix}
                        disabled={submitting}
                        onChange={(event) => {
                          const next = event.target.value
                            .replace(/[^\d+]/g, "")
                            .replace(/(?!^)\+/g, "")
                            .slice(0, 5);
                          setCustomPhonePrefix(next);
                          form.setFields([{ name: "mobile", errors: [] }]);
                        }}
                      />
                    ) : null}
                    <div className={styles.phoneInputWrap}>
                      <Form.Item
                        name="mobile"
                        noStyle
                        rules={[
                          {
                            validator: async (_, value) => {
                              const errors = validateTrialMerchantForm({
                                name: "x",
                                mobile: value ?? "",
                                phonePrefix: effectivePhonePrefix,
                                officialIdNumber: "123456789012345",
                                settlementMode: "PLATFORM",
                                settlementCurrency: "USD",
                              });
                              if (errors.mobile) {
                                throw new Error(t(errors.mobile as "errors.mobileInvalid"));
                              }
                            },
                          },
                        ]}
                      >
                        <Input
                          inputMode="tel"
                          autoComplete="tel-national"
                          maxLength={20}
                          placeholder={t("fields.mobilePlaceholder")}
                          className={styles.phoneInput}
                          allowClear
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Form.Item>
              </div>

              <div className={styles.fullWidth}>
                <Form.Item
                  name="officialIdNumber"
                  label={
                    <span className={styles.labelWithHelp}>
                      <span>
                        {t("fields.officialIdNumber")} <span className={styles.required}>*</span>
                      </span>
                      <Tooltip title={t("fields.officialIdHelp")}>
                        <span className={styles.helpHint}>
                          <HelpCircle size={11} strokeWidth={2} />
                          {t("fields.officialIdHelpLabel")}
                        </span>
                      </Tooltip>
                    </span>
                  }
                  rules={[{ required: true, message: t("errors.officialIdInvalid") }]}
                >
                  <Input
                    maxLength={18}
                    placeholder={t("fields.officialIdPlaceholder")}
                    className={styles.textInputMono}
                    prefix={<CreditCard size={16} className={styles.prefixIcon} aria-hidden />}
                  />
                </Form.Item>
              </div>
            </div>

            <div className={styles.modeCard}>
              <div className={styles.modeHeader}>
                <div>
                  <p className={styles.modeTitle}>
                    <Network size={15} strokeWidth={2} aria-hidden />
                    {t("fields.settlementMode")} <span className={styles.required}>*</span>
                  </p>
                  <p className={styles.modeHint}>{t("fields.settlementModeShort")}</p>
                </div>
              </div>
              <Form.Item
                name="settlementMode"
                rules={[{ required: true, message: t("errors.settlementModeRequired") }]}
              >
                <Radio.Group className={styles.modeOptionGroup}>
                  <Radio value="PLATFORM">
                    <span className={styles.modeOptionTitle}>{t("modes.platform")}</span>
                    <span className={styles.modeOptionDetail}>
                      <span className={styles.modeOptionFlow}>
                        <span className={styles.modeOptionFlowLabel}>{t("modes.flowLabel")}</span>
                        {t("modes.platformFlow")}
                      </span>
                      <span className={styles.modeOptionFlow}>
                        <span className={styles.modeOptionFlowLabel}>{t("modes.channelLabel")}</span>
                        {t("modes.platformChannel")}
                      </span>
                    </span>
                  </Radio>
                  <Radio value="DIRECT">
                    <span className={styles.modeOptionTitle}>{t("modes.direct")}</span>
                    <span className={styles.modeOptionDetail}>
                      <span className={styles.modeOptionFlow}>
                        <span className={styles.modeOptionFlowLabel}>{t("modes.flowLabel")}</span>
                        {t("modes.directFlow")}
                      </span>
                      <span className={styles.modeOptionFlow}>
                        <span className={styles.modeOptionFlowLabel}>{t("modes.channelLabel")}</span>
                        {t("modes.directChannel")}
                      </span>
                    </span>
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <p className={styles.modeNote}>{t("fields.settlementModeNote")}</p>
            </div>

            <div className={styles.currencyCard}>
              <div className={styles.currencyHeader}>
                <div>
                  <p className={styles.currencyTitle}>
                    <Coins size={15} strokeWidth={2} aria-hidden />
                    {t("fields.settlementCurrency")} <span className={styles.required}>*</span>
                  </p>
                  <p className={styles.currencyHint}>{t("fields.settlementCurrencyShort")}</p>
                </div>
                <span className={styles.immutableTag}>
                  <AlertTriangle size={11} strokeWidth={2.5} />
                  {t("fields.settlementImmutable")}
                </span>
              </div>
              <Form.Item
                name="settlementCurrency"
                rules={[{ required: true, message: t("errors.settlementCurrencyRequired") }]}
              >
                <Select
                  className={styles.currencySelect}
                  showSearch
                  optionFilterProp="label"
                  options={SETTLEMENT_CURRENCY_OPTIONS.map((item) => ({
                    value: item.value,
                    label: formatSettlementCurrencyLabel(item.value, locale),
                  }))}
                />
              </Form.Item>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className={styles.submitBtn}
              icon={<ArrowRight size={16} strokeWidth={2.5} />}
              iconPosition="end"
            >
              {submitting ? t("submitting") : t("submit")}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
