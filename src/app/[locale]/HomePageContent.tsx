"use client";

import SiteNavbar from "@/components/marketing/SiteNavbar";
import SiteFooter from "@/components/marketing/SiteFooter";
import HeroSection from "@/components/marketing/home/HeroSection";
import CoreCapabilitiesSection from "@/components/marketing/home/CoreCapabilitiesSection";
import MerchantCenterSection from "@/components/marketing/home/MerchantCenterSection";
import SolutionsSection from "@/components/marketing/home/SolutionsSection";
import EnterpriseSection from "@/components/marketing/home/EnterpriseSection";
import DeveloperSection from "@/components/marketing/home/DeveloperSection";
import SecuritySection from "@/components/marketing/home/SecuritySection";
import FinalCtaSection from "@/components/marketing/home/FinalCtaSection";
import styles from "./home.module.css";

export default function HomePageContent() {
  return (
    <div className={styles.page}>
      <SiteNavbar />
      <HeroSection />
      <CoreCapabilitiesSection />
      <MerchantCenterSection />
      <SolutionsSection />
      <EnterpriseSection />
      <DeveloperSection />
      <SecuritySection />
      <FinalCtaSection />
      <SiteFooter />
    </div>
  );
}
