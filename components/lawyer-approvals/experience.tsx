import { Badge } from "../ui/badge";
import { Download, Package2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { LawyerProfile } from "@/types/lawyer-approvals";

export default function Experience({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  const t = useTranslations("LawyerApprovals.Experience");

  return (
    <div className="space-y-6">
      {lawyerProfile.experience.map((exp, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <Badge className="w-10 h-10 bg-secondary/10 text-secondary rounded-full">
            <Package2 className="size-4!" />
          </Badge>

          <div className="space-y-0.5">
            <p className="text-[13.5px] font-semibold text-gray-800">
              {exp.title}
            </p>
            <p className="text-[12.5px] text-gray-600">{exp.organization}</p>
            <p className="text-[11.5px] text-gray-400">
              {exp.start_year} - {exp.is_current ? t("Present") : exp.end_year}
            </p>
            {exp.certificate_url && (
              <a href={exp.certificate_url} download>
                <Download className="text-primary size-5" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
