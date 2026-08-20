import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";
import MainTitle from "../reusable/main-title";
import { Lawyer } from "@/types/lawyer-approvals";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ProfessionalInfo({ lawyer }: { lawyer: Lawyer }) {
  const t = useTranslations("LawyerApprovals.ProfessionalInfo");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-18 border-2 border-white/25">
          <AvatarImage
            src={lawyer.photo_url || ""}
            alt={lawyer.name || "User Avatar"}
            className="object-cover"
          />
          <AvatarFallback className="uppercase bg-primary text-white">
            {lawyer.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="text-[15px] font-bold text-gray-900">{lawyer.name}</p>
          <p className="text-[11px] text-gray-400">
            {lawyer.lawyer_profile.account_type}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <MainTitle className="w-50">{t("phone")}</MainTitle>
          <p className="text-[13px] text-gray-700">{lawyer.phone}</p>
        </div>

        <div className="flex items-center">
          <MainTitle className="w-50">{t("email")}</MainTitle>
          <p className="text-[13px] text-gray-700">{lawyer.email}</p>
        </div>

        <div className="flex items-center">
          <MainTitle className="w-50">{t("location")}</MainTitle>
          <p className="text-[13px] text-gray-700">{lawyer.country}</p>
        </div>

        <div className="flex items-center">
          <MainTitle className="w-50">{t("emirate")}</MainTitle>
          <p className="text-[13px] text-gray-700">{lawyer.city}</p>
        </div>

        <div className="flex items-center">
          <MainTitle className="w-50">{t("yearsOfExperience")}</MainTitle>
          <p className="text-[13px] text-gray-700">
            {lawyer.lawyer_profile.years_of_experience}
          </p>
        </div>

        <div className="flex items-center">
          <MainTitle className="w-50">{t("submissionDate")}</MainTitle>
          <p className="text-[13px] text-gray-700">
            {formatDate(lawyer.lawyer_profile.submitted_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
