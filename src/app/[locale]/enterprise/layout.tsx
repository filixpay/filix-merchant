import type { Metadata } from "next";
import EnterpriseDashboardLayout from "@/components/layout/EnterpriseDashboardLayout";
import { DashboardContentModeProvider } from "@/components/layout/dashboard-content-mode-context";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardContentModeProvider>
      <EnterpriseDashboardLayout>{children}</EnterpriseDashboardLayout>
    </DashboardContentModeProvider>
  );
}
