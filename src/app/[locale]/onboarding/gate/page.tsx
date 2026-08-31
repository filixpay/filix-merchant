"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Alert, Button, Spin } from "antd";
import { api } from "@/lib/api";
import {
  membershipStateFromOrganizations,
  resolvePostAuthPath,
} from "@/lib/auth/merchant-context-resolver";
import {
  persistOrganizationSelection,
  writeOrganizationsCache,
} from "@/components/layout/organization-shell";
import {
  classifyPortalApiAuthError,
  shouldReauthOnPortalApiError,
} from "@/lib/onboarding/portal-api-auth-error";

/**
 * Post-auth Context Resolver for merchant portal.
 * Login success lands here before Merchant Center / create-merchant.
 */
export default function OnboardingGatePage() {
  const t = useTranslations("FirstOnboarding");
  const locale = useLocale();
  const router = useRouter();
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || session?.error === "RefreshAccessTokenError") {
      void signIn("keycloak", {
        callbackUrl: `/${locale}/onboarding/gate`,
      });
    }
  }, [status, session?.error, locale]);

  useEffect(() => {
    if (status !== "authenticated" || !accessToken || session?.error) return;
    let cancelled = false;
    (async () => {
      setErrorKey(null);
      try {
        const orgs = await api.organizations.list(accessToken);
        if (cancelled) return;
        writeOrganizationsCache(orgs);
        if (orgs[0]) {
          persistOrganizationSelection(orgs[0]);
        }
        const membership = membershipStateFromOrganizations(orgs);
        const next = resolvePostAuthPath({
          locale,
          portalIntent: "merchant",
          membership,
        });
        router.replace(next);
      } catch (err) {
        if (cancelled) return;
        const authKind = classifyPortalApiAuthError(err, true);
        if (shouldReauthOnPortalApiError(authKind)) {
          void signIn("keycloak", {
            callbackUrl: `/${locale}/onboarding/gate`,
          });
          return;
        }
        setErrorKey(
          authKind === "portal_rejected"
            ? "errors.portalAuthRejected"
            : "errors.orgsLoadFailed",
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, accessToken, session?.error, locale, router]);

  if (errorKey) {
    return (
      <div style={{ maxWidth: 480, margin: "4rem auto", padding: 24 }}>
        <Alert type="error" message={t(errorKey as "errors.orgsLoadFailed")} />
        <Button
          style={{ marginTop: 16, marginRight: 8 }}
          onClick={() => window.location.reload()}
        >
          {t("retry")}
        </Button>
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={() =>
            void signIn("keycloak", {
              callbackUrl: `/${locale}/onboarding/gate`,
            })
          }
        >
          {t("relogin")}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
      <Spin size="large" />
    </div>
  );
}
