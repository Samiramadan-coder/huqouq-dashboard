import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Titled card used to group profile information in the details sheets.
export function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {title}
      </h2>

      <Card className="gap-0 rounded-2xl border-0 bg-gray-50 py-0 shadow-none">
        <CardContent className="p-4">{children}</CardContent>
      </Card>
    </section>
  );
}

// Label / value row; must be rendered inside a `<dl>`.
export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start sm:gap-3">
      <dt className="text-[11px] font-bold uppercase leading-5 text-gray-400">
        {label}
      </dt>

      <dd className="min-w-0 wrap-break-word text-[13px] leading-5 text-gray-700">
        {children}
      </dd>
    </div>
  );
}

// Email and phone rows, with a translated fallback when a value is missing.
export function ContactRows({
  email,
  phone,
  labels,
}: {
  email: string | null;
  phone: string | null;
  labels: { email: string; phone: string; notAvailable: string };
}) {
  return (
    <>
      <InfoRow label={labels.email}>
        {email ? (
          <a href={`mailto:${email}`} className="text-primary hover:underline">
            <bdi dir="ltr">{email}</bdi>
          </a>
        ) : (
          <span className="text-gray-400">{labels.notAvailable}</span>
        )}
      </InfoRow>

      <InfoRow label={labels.phone}>
        {phone ? (
          <a href={`tel:${phone}`} className="hover:underline">
            <bdi dir="ltr">{phone}</bdi>
          </a>
        ) : (
          <span className="text-gray-400">{labels.notAvailable}</span>
        )}
      </InfoRow>
    </>
  );
}
