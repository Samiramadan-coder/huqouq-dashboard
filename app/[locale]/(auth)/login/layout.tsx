import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// The login page is a Client Component, so its metadata lives here.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("login") };
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
