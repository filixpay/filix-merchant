import { describe, expect, it } from "vitest";
import {
  MERCHANT_AGREEMENT_VERSION,
  REQUIRED_ONBOARDING_ACCEPTANCES,
} from "@/lib/onboarding/required-agreements";
import { legalDocumentPath } from "@/lib/legal/content-locales";
import { getMerchantFees, getMerchantTerms } from "@/content/legal/loaders";

describe("required onboarding agreements", () => {
  it("requires service agreement and fee rules at V1.0.0", () => {
    expect(REQUIRED_ONBOARDING_ACCEPTANCES).toEqual([
      {
        agreementType: "MERCHANT_SERVICE_AGREEMENT",
        agreementVersion: MERCHANT_AGREEMENT_VERSION,
      },
      {
        agreementType: "MERCHANT_FEE_RULES",
        agreementVersion: MERCHANT_AGREEMENT_VERSION,
      },
    ]);
    expect(MERCHANT_AGREEMENT_VERSION).toBe("V1.0.0");
  });
});

describe("merchant legal documents", () => {
  it("exposes merchant terms and fees paths", () => {
    expect(legalDocumentPath("merchant-terms")).toBe("/merchant/terms");
    expect(legalDocumentPath("merchant-fees")).toBe("/merchant/fees");
    expect(legalDocumentPath("privacy")).toBe("/privacy");
  });

  it("states SaaS is free and commerce is 5% without free-allowance wording", () => {
    const feesZh = getMerchantFees("zh");
    const feesEn = getMerchantFees("en");
    const termsZh = getMerchantTerms("zh");
    const zhText = JSON.stringify(feesZh);
    const enText = JSON.stringify(feesEn);
    const termsZhText = JSON.stringify(termsZh);

    expect(feesZh.sections.length).toBeGreaterThanOrEqual(13);
    expect(termsZh.sections.length).toBeGreaterThanOrEqual(37);

    expect(zhText).toContain("免费");
    expect(zhText).toContain("5%");
    expect(zhText).toContain("付款触发阈值");
    expect(zhText).toContain("不是免收费额度");
    expect(zhText).not.toMatch(/1%/);
    expect(zhText).not.toContain("免费额度");

    expect(enText).toMatch(/Free/i);
    expect(enText).toContain("5%");
    expect(enText).toMatch(/payment[- ]trigger threshold/i);
    expect(enText).toContain("not a free allowance");
    expect(enText).not.toMatch(/1%/);
    expect(enText.toLowerCase()).not.toContain("top up");
    expect(enText.toLowerCase()).not.toContain("wallet fee");

    expect(termsZhText).toContain("第三十七条");
    expect(termsZh.title).toContain("商户服务协议");
    expect(getMerchantTerms("en").title).toContain("Merchant Service Agreement");
  });
});
