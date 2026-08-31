import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function EnterpriseIndexPage({ params }: PageProps) {
  const { locale } = await params;
  redirect(`/${locale}/enterprise/dashboard`);
}
