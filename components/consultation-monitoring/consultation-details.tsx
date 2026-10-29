"use client";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

import { ArrowRight } from "lucide-react";

import { Button } from "../ui/button";
import { useRef, useState } from "react";

import { getConsultationDetails } from "@/lib/consultation-monitoring";
import {
  ActionFailure,
  ConsultationDetailsType,
} from "@/types/consultation-monitoring";

type DetailsState =
  | { status: "loading" }
  | { status: "error"; error: ActionFailure }
  | { status: "ready"; service: ConsultationDetailsType };

// "View" button that opens a sheet with the service details. Details are
// fetched through a server action each time the sheet opens.
export default function ConsultationDetails({
  consultationId,
}: {
  consultationId: number;
}) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<DetailsState>({ status: "loading" });
  const requestId = useRef(0);

  // A silent reload keeps the current details (and selected tab) on screen
  // while refetching, e.g. after an admin action.
  async function loadDetails({ silent = false } = {}) {
    const current = ++requestId.current;
    if (!silent) setDetails({ status: "loading" });

    try {
      const result = await getConsultationDetails(consultationId);
      if (current !== requestId.current) return;

      console.log(result);

      setDetails(
        result.success
          ? { status: "ready", service: result.data }
          : { status: "error", error: result.error },
      );
    } catch {
      if (current === requestId.current) {
        setDetails({ status: "error", error: "failed" });
      }
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      void loadDetails();
    } else {
      requestId.current++;
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="default" className="rounded-sm text-xs">
          View
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-5xl gap-0"></SheetContent>
    </Sheet>
  );
}
