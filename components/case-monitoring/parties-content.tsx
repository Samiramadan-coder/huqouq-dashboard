import { formatDate } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Shield, Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CaseMonitoring } from "@/types/case-monitoring";

export default async function PartiesContent({
  caseItem,
}: {
  caseItem: CaseMonitoring;
}) {
  const t = await getTranslations("CaseMonitoring");

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card className="rounded-xl ring-0! border border-blue-100 bg-blue-50/40 shadow-none p-0">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary text-base font-semibold text-white">
                {caseItem.client.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-[16px] font-semibold text-primary">
                {caseItem.client.name}
              </h3>
              <p className="mt-0.5 text-[11px] font-medium uppercase text-blue-600">
                {t("Participants.Client.role")}
              </p>
            </div>
          </div>

          <Separator className="my-3 bg-blue-200/70" />

          <div className="space-y-3">
            <InfoRow
              label={t("Participants.Client.email")}
              value={caseItem.client.email}
            />

            <InfoRow
              label={t("Participants.Client.phone")}
              value={caseItem.client.phone}
            />

            <InfoRow
              label={t("Participants.Client.joined")}
              value={formatDate(caseItem.client.joined_at)}
            />

            <InfoRow
              label={t("Participants.Client.totalCases")}
              value={caseItem.client.cases_count}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lawyer */}
      <Card className="rounded-xl border-emerald-200 bg-emerald-50/30 shadow-none p-0">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="bg-emerald-700 text-base font-semibold text-white">
                {caseItem.hired_lawyer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-[16px] font-semibold text-primary">
                  {caseItem.hired_lawyer.name}
                </h3>
                <Shield className="size-4 text-emerald-500" />
              </div>

              <p className="mt-0.5 text-[11px] font-medium uppercase text-emerald-700">
                {t("Participants.Lawyer.role")}
              </p>
            </div>
          </div>

          <Separator className="my-3 bg-emerald-200/70" />

          <div className="space-y-3">
            <InfoRow
              label={t("Participants.Lawyer.specialization")}
              value={caseItem.hired_lawyer.specialization}
            />

            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
              <span className="text-[11px] text-primary/45">
                {t("Participants.Lawyer.rating")}
              </span>
              <div className="flex items-center gap-1">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[13px] font-medium text-primary/80">
                  {caseItem.hired_lawyer.rating ?? "-"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
      <span className="text-[11px] text-primary/45">{label}</span>
      <span className="text-[13px] font-medium text-primary/80">{value}</span>
    </div>
  );
}
