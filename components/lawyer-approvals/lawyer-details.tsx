import { CircleCheck, CircleX, Clock, ChevronLeft } from "lucide-react";
import { Lawyer, ReviewItem } from "@/types/lawyer-approvals";
import Education from "./education";
import Experience from "./experience";
import LanguagesBio from "./languages-bio";
import ReviewSection from "./review-section";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import BarCertificates from "./bar-certificates";
import DecisionActions from "./decision-actions";
import ProfessionalInfo from "./professional-info";
import SpecializationServices from "./specialization-services";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Server-rendered review page. Only the review controls are client components,
// so the full lawyer record is never serialized to the browser.
export default function LawyerDetails({ lawyer }: { lawyer: Lawyer }) {
  const t = useTranslations("LawyerApprovals");
  const reviewItems = lawyer.lawyer_profile.review_items;

  const approvedCount = reviewItems.filter(
    (item) => item.status === "approved",
  ).length;
  const flaggedCount = reviewItems.filter(
    (item) => item.status === "flagged",
  ).length;
  const pendingCount = reviewItems.length - approvedCount - flaggedCount;

  return (
    <>
      <div className="p-4 sm:p-6 bg-white border-b border-gray-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/lawyer-approvals" className="flex items-center gap-3">
            <ChevronLeft className="rtl:rotate-180 size-4" />
            <p className="text-[13px] text-gray-500">{t("backToPending")}</p>
          </Link>
          <span aria-hidden className="text-gray-200 text-lg">
            /
          </span>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={lawyer.photo_url ?? undefined} alt={lawyer.name} />
              <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-[13px] font-semibold text-gray-800 line-clamp-1">
                {lawyer.name}
              </h1>
              <p className="text-[11px] text-gray-400 line-clamp-1">
                {lawyer.lawyer_profile.specializations
                  .map((spec) => spec.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-green-700 text-[12px]">
            <CircleCheck className="size-3.5" />
            {approvedCount} {t("approved")}
          </span>

          <span className="flex items-center gap-1 text-red-600 text-[12px]">
            <CircleX className="size-3.5" />
            {flaggedCount} {t("rejected")}
          </span>

          <span className="flex items-center gap-1 text-gray-400 text-[12px]">
            <Clock className="size-3.5" />
            {pendingCount} {t("toReview")}
          </span>
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-6 mb-20">
        {reviewItems.map((item) => (
          <ReviewSection key={item.item} item={item} lawyerId={lawyer.id}>
            <SectionContent item={item} lawyer={lawyer} />
          </ReviewSection>
        ))}
      </div>

      <DecisionActions
        lawyerId={lawyer.id}
        allReviewed={pendingCount === 0}
        hasFlagged={flaggedCount > 0}
      />
    </>
  );
}

// Renders the read-only content of a review section.
function SectionContent({ item, lawyer }: { item: ReviewItem; lawyer: Lawyer }) {
  switch (item.item) {
    case "professional_info":
      return <ProfessionalInfo lawyer={lawyer} />;
    case "specializations_services":
      return <SpecializationServices lawyerProfile={lawyer.lawyer_profile} />;
    case "languages_bio":
      return <LanguagesBio lawyerProfile={lawyer.lawyer_profile} />;
    case "education":
      return <Education lawyerProfile={lawyer.lawyer_profile} />;
    case "experience":
      return <Experience lawyerProfile={lawyer.lawyer_profile} />;
    case "bar_certificate":
      return <BarCertificates lawyerProfile={lawyer.lawyer_profile} />;
  }
}
