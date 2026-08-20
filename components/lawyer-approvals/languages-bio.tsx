import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";
import MainTitle from "../reusable/main-title";
import { LawyerProfile } from "@/types/lawyer-approvals";

export default function LanguagesBio({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  const t = useTranslations("LawyerApprovals.LanguagesBio");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <MainTitle>{t("languagesSpoken")}</MainTitle>
        <div className="space-x-2">
          {lawyerProfile.languages.map((lang) => (
            <Badge
              className="bg-amber-50 text-amber-600 text-[10px] border border-amber-200 h-6 min-w-16"
              key={lang}
            >
              {lang}
            </Badge>
          ))}
        </div>
      </div>

      {lawyerProfile.bio && (
        <div className="space-y-2">
          <MainTitle>{t("professionalBio")}</MainTitle>
          <p className="text-[13px] text-gray-700 leading-relaxed bg-gray-50/60 rounded-md px-4 py-3 border border-gray-100">
            {lawyerProfile.bio}
          </p>
        </div>
      )}

      {lawyerProfile.website_url && (
        <div className="space-y-2">
          <MainTitle>{t("websiteUrl")}</MainTitle>
          <a
            href={lawyerProfile.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[13px] text-gray-700 leading-relaxed bg-gray-50/60 rounded-md px-4 py-3 border border-gray-100"
          >
            {lawyerProfile.website_url}
          </a>
        </div>
      )}
    </div>
  );
}
