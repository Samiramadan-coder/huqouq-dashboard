"use client";

import {
  User,
  Flag,
  Globe,
  Check,
  Package2,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  CheckCircle,
  Lock,
  CircleX,
} from "lucide-react";

import {
  Lawyer,
  ItemKey,
  ReasonFormData,
  reasonSchema,
  ReviewItem,
} from "@/types/lawyer-approvals";

import {
  flagSection,
  undoSection,
  approveSection,
  rejectProfile,
  approveProfile,
} from "@/lib/lawyer-approvals";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import Education from "./education";
import { Badge } from "../ui/badge";
import Experience from "./experience";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import LanguagesBio from "./languages-bio";
import { useTranslations } from "next-intl";
import BarCertificates from "./bar-certificates";
import NormalFormTextarea from "../form/textarea";
import ProfessionalInfo from "./professional-info";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import SpecializationServices from "./specialization-services";

export default function LawyerDetails({ lawyer }: { lawyer: Lawyer }) {
  const t = useTranslations("LawyerApprovals");
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  // Handles the rejection of the lawyer's profile,
  // providing feedback to the admin based on the success or failure of the operation.
  async function reject() {
    setLoadingReject(true);
    const result = await rejectProfile(lawyer.id);
    setLoadingReject(false);
    if (result.success) {
      toast.success(t("profileRejected"));
      return;
    }
    toast.error(t("profileRejectFailed"));
  }

  // Handles the approval of the lawyer's profile,
  // providing feedback to the admin based on the success or failure of the operation.
  async function approve() {
    setLoadingApprove(true);
    const result = await approveProfile(lawyer.id);
    setLoadingApprove(false);
    if (result.success) {
      toast.success(t("profileApproved"));
      return;
    }
    toast.error(t("profileApproveFailed"));
  }

  // Counts the number of sections in the lawyer's profile that have been flagged (rejected).
  const countRejectedSections = useMemo(() => {
    return lawyer.lawyer_profile.review_items.filter(
      (item) => item.status === "flagged",
    ).length;
  }, [lawyer.lawyer_profile.review_items]);

  // Counts the number of sections in the lawyer's profile that have been approved.
  const countApprovedSections = useMemo(() => {
    return lawyer.lawyer_profile.review_items.filter(
      (item) => item.status === "approved",
    ).length;
  }, [lawyer.lawyer_profile.review_items]);

  return (
    <>
      <div className="space-y-6 p-4 sm:p-6 mb-20">
        {lawyer.lawyer_profile.review_items.map((item, index) => (
          <SingleSection key={index} item={item} lawyer={lawyer} />
        ))}
      </div>

      <div className="p-4 sm:p-6 bg-white flex justify-end border-t border-gray-200l space-x-4 fixed bottom-0 inset-s-0 w-full">
        <Button
          onClick={reject}
          disabled={
            loadingReject ||
            countApprovedSections + countRejectedSections !==
              lawyer.lawyer_profile.review_items.length ||
            countRejectedSections === 0
          }
          variant="outline"
          className="bg-red-50 border-red-200 text-red-600 text-[13px] h-10 hover:bg-red-100 hover:text-red-700"
        >
          {loadingReject && <Spinner className="size-3" />}
          <Lock className="size-3" />
          <CircleX className="size-3" />
          {t("reject")}
        </Button>

        <Button
          onClick={approve}
          disabled={
            loadingApprove ||
            countApprovedSections + countRejectedSections !==
              lawyer.lawyer_profile.review_items.length ||
            countRejectedSections > 0
          }
          variant="outline"
          className="bg-green-50 border-green-200 text-green-600 text-[13px] h-10 hover:bg-green-100 hover:text-green-700"
        >
          {loadingApprove && <Spinner className="size-3" />}
          <Lock className="size-3" />
          <CheckCircle className="size-3" />
          {t("approve")}
        </Button>
      </div>
    </>
  );
}

// Represents a single section of the lawyer's profile that can be reviewed, approved, flagged, or undone.
// It displays the section's details, status, and provides controls for the admin to take actions on that section.
function SingleSection({ item, lawyer }: { item: ReviewItem; lawyer: Lawyer }) {
  const t = useTranslations("LawyerApprovals");
  const [loadingUndo, setLoadingUndo] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [itemKey, setItemKey] = useState<ItemKey | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReasonFormData>({
    defaultValues: { reason: "" },
    resolver: zodResolver(reasonSchema(t)),
  });

  // Handles the approval of a specific section for the lawyer.
  async function handleApprove(itemKey: ItemKey) {
    setLoadingApprove(true);
    const result = await approveSection(lawyer.id, itemKey);
    setLoadingApprove(false);
    if (result.success) {
      toast.success(t("sectionApproved"));
      return;
    }
    toast.error(t("sectionApprovalFailed"));
  }

  // Handles the submission of the flagging form for a specific section.
  const onSubmit: SubmitHandler<ReasonFormData> = async (data) => {
    if (!itemKey) return;
    const result = await flagSection(lawyer.id, itemKey, data.reason);
    if (result.success) {
      setItemKey(null);
      toast.success(t("sectionFlagged"));
      return;
    }
    toast.error(t("sectionFlagFailed"));
  };

  // Handles the undo action for a specific section, reverting its status back to pending.
  async function handleUndo(itemKey: ItemKey) {
    setLoadingUndo(true);
    const result = await undoSection(lawyer.id, itemKey);
    setLoadingUndo(false);
    if (result.success) {
      toast.success(t("sectionUndoSuccess"));
      return;
    }
    toast.error(t("sectionUndoFailed"));
  }

  return (
    <div
      className={cn("border rounded-md overflow-hidden", {
        "border-primary/15": item.status === "pending",
        "border-green-200": item.status === "approved",
        "border-red-200": item.status === "flagged",
      })}
    >
      {/* Section Head */}
      <div
        className={cn("p-4 flex items-center justify-between ", {
          "bg-gray-50/60": item.status === "pending",
          "bg-green-50/60": item.status === "approved",
          "bg-red-50/60": item.status === "flagged",
        })}
      >
        <p className="text-[13.5px] font-semibold text-gray-800 flex items-center gap-2">
          {getIconForItem(item.item)}
          {item.item_label}
        </p>

        <div className="flex items-center gap-2">
          {item.status === "pending" ? (
            <>
              <Button
                variant="outline"
                disabled={loadingApprove}
                onClick={() => handleApprove(item.item)}
                className="bg-green-50 border-green-200 text-green-700 text-[11.5px] hover:bg-green-100 hover:text-green-700"
              >
                {loadingApprove ? (
                  <Spinner className="size-3" />
                ) : (
                  <Check className="size-3" />
                )}
                {t("approveSection")}
              </Button>
              <Button
                variant="outline"
                className="bg-red-50 border-red-200 text-red-700 text-[11.5px] hover:bg-red-100 hover:text-red-700"
                onClick={() => setItemKey(item.item)}
              >
                <Flag className="size-3" />
                {t("flagSection")}
              </Button>
            </>
          ) : (
            <>
              <Badge
                className={cn("text-[11.5px] py-3 px-3", {
                  "bg-green-50 text-green-700 border border-green-200":
                    item.status === "approved",
                  "bg-red-50 text-red-700 border border-red-200":
                    item.status === "flagged",
                })}
              >
                {item.status === "approved" ? (
                  <CheckCircle className="size-3" />
                ) : (
                  <Flag className="size-3" />
                )}
                {item.status === "approved" ? t("approved") : t("flagged")}
              </Badge>

              <Button
                variant="ghost"
                onClick={() => handleUndo(item.item)}
                disabled={loadingUndo}
                className="text-[11.5px] text-gray-400"
              >
                {loadingUndo && <Spinner className="size-3" />}
                {t("undo")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div
        className={cn("p-4 border-t ", {
          "border-primary/15": item.status === "pending",
          "border-green-200": item.status === "approved",
          "border-red-200": item.status === "flagged",
        })}
      >
        {item.item === "professional_info" && (
          <ProfessionalInfo lawyer={lawyer} />
        )}
        {item.item === "specializations_services" && (
          <SpecializationServices lawyerProfile={lawyer.lawyer_profile} />
        )}
        {item.item === "languages_bio" && (
          <LanguagesBio lawyerProfile={lawyer.lawyer_profile} />
        )}
        {item.item === "education" && (
          <Education lawyerProfile={lawyer.lawyer_profile} />
        )}
        {item.item === "experience" && (
          <Experience lawyerProfile={lawyer.lawyer_profile} />
        )}
        {item.item === "bar_certificate" && (
          <BarCertificates lawyerProfile={lawyer.lawyer_profile} />
        )}
      </div>

      {item.status === "flagged" && item.reason && (
        <div className="p-4 border-t border-red-200 bg-red-50">
          <p className="text-[13px] text-red-700">{item.reason}</p>
        </div>
      )}

      {item.item === itemKey && (
        <form className="p-4 sm:p-6" onSubmit={handleSubmit(onSubmit)}>
          <NormalFormTextarea
            register={register}
            name="reason"
            label={t("reasonLabel")}
            placeholder={t("reasonPlaceholder")}
            errors={errors}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              variant="outline"
              className="border border-red-200 bg-red-50 text-red-600 text-[13px]"
            >
              {isSubmitting && <Spinner className="size-3" />}
              {t("flagSection")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// Returns the appropriate icon component based on the item key
// This function maps each item key to its corresponding icon from the lucide-react library
// It helps in rendering the correct icon for each section in the lawyer details view
function getIconForItem(item: ItemKey) {
  switch (item) {
    case "professional_info":
      return <User className="size-4" />;
    case "specializations_services":
      return <BookOpen className="size-4" />;
    case "languages_bio":
      return <Globe className="size-4" />;
    case "education":
      return <GraduationCap className="size-4" />;
    case "experience":
      return <Package2 className="size-4" />;
    case "bar_certificate":
      return <ShieldCheck className="size-4" />;
    default:
      return null;
  }
}
