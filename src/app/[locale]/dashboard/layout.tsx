import type { Metadata } from "next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DashboardContentModeProvider } from "@/components/layout/dashboard-content-mode-context";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardContentModeProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardContentModeProvider>
  );
}
