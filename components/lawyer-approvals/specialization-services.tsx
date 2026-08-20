import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";
import MainTitle from "../reusable/main-title";
import { LawyerProfile } from "@/types/lawyer-approvals";

export default function SpecializationServices({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  const t = useTranslations("LawyerApprovals.Specialization");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <MainTitle>{t("mainSpecializations")}</MainTitle>
        <div className="space-x-2">
          {lawyerProfile.specializations.map((spec) => (
            <Badge
              className="bg-primary/6 text-primary text-[12px] border border-primary/10 min-w-16 h-6"
              key={spec.name}
            >
              {spec.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <MainTitle>{t("subSpecializations")}</MainTitle>
        <div className="space-x-2">
          {lawyerProfile.services.map((service) => (
            <Badge
              className="bg-transparent text-primary text-[12px] border border-primary/10 min-w-16 h-6"
              key={service.name}
            >
              {service.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
