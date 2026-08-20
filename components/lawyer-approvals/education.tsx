import { Badge } from "../ui/badge";
import { Download, GraduationCap } from "lucide-react";
import { LawyerProfile } from "@/types/lawyer-approvals";

export default function Education({
  lawyerProfile,
}: {
  lawyerProfile: LawyerProfile;
}) {
  return (
    <div className="space-y-6">
      {lawyerProfile.education.map((edu, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <Badge className="w-10 h-10 bg-primary/10 text-primary rounded-full">
            <GraduationCap className="size-4!" />
          </Badge>

          <div className="space-y-0.5">
            <p className="text-[13.5px] font-semibold text-gray-800">
              {edu.degree}
            </p>
            <p className="text-[12.5px] text-gray-600">{edu.university}</p>
            <p className="text-[11.5px] text-gray-400">
              {edu.graduation_month}-{edu.graduation_year}
            </p>
            {edu.certificate_url && (
              <a href={edu.certificate_url} download>
                <Download className="text-primary size-5" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
