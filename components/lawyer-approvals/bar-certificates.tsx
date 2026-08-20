import { useTranslations } from "next-intl";
import MainTitle from "../reusable/main-title";
import { LawyerProfile } from "@/types/lawyer-approvals";

export default function BarCertificates({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  const t = useTranslations("LawyerApprovals.BarCertificate");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2 space-y-4">
        <MainTitle>{t("title")}</MainTitle>
        <iframe
          src={lawyerProfile.bar_certificate_url}
          className="w-full h-250 rounded-lg"
        />
      </div>
    </div>
  );
}
