import { CaseDetails } from "@/types/case-approvals";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Banknote,
  CalendarDays,
  FileText,
  MapPin,
  Paperclip,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { formatDate } from "@/lib/utils";

export default function CaseDetailsPreview({
  caseDetails,
}: {
  caseDetails: CaseDetails;
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 sm:p-6 bg-white flex justify-end border-t border-gray-200l space-x-4 fixed bottom-0 inset-s-0 w-full"></div>

      <Card className="py-0 gap-0 ring-0! border border-primary/15">
        <CardHeader className="gap-2 px-5 py-4">
          <CardTitle className="text-base font-bold">
            {caseDetails.title}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Badge
              variant="outline"
              className="font-normal text-[11px] bg-primary/5 border-primary/20 text-primary"
            >
              {caseDetails.specialization.name}
            </Badge>

            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <MapPin className="size-3.5" />
              <span>{caseDetails.city}</span>
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <CalendarDays className="size-3.5" />
              <span>Submitted {formatDate(caseDetails.created_at)}</span>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-primary/15" />

        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Client
            </p>

            <div className="flex items-center gap-3">
              <Avatar className="size-7">
                <AvatarImage
                  src={caseDetails.client.photo_url || ""}
                  alt={caseDetails.client.name}
                />
                <AvatarFallback className="bg-emerald-700 text-xs text-white">
                  {caseDetails.client.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="text-[13px] font-semibold text-gray-800">
                  {caseDetails.client.name}
                </p>
                <p className="text-[11px] text-gray-400">{caseDetails.city}</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Budget
            </p>

            <div className="flex items-center gap-2">
              <Banknote className="size-4 text-gray-400" />
              <span className="text-[13px] font-semibold text-gray-800">
                {caseDetails.budget_min} - {caseDetails.budget_max}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0 gap-0 ring-0! border border-primary/15">
        <CardHeader className="gap-2 px-5 py-4">
          <CardTitle className="text-[13.5px] font-semibold flex items-center gap-2">
            <FileText className="size-4 text-secondary" />
            Case Description
          </CardTitle>
        </CardHeader>
        <Separator className="bg-primary/15" />
        <CardContent className="p-0">
          <p className="p-4 text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line">
            {caseDetails.description}
          </p>
        </CardContent>
      </Card>

      <Card className="py-0 gap-0 ring-0! border border-primary/15">
        <CardHeader className="gap-2 px-5 py-4">
          <CardTitle className="text-[13.5px] font-semibold flex items-center gap-2">
            <Paperclip className="size-4 text-secondary" />
            Attached Documents
          </CardTitle>
        </CardHeader>
        <Separator className="bg-primary/15" />
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {caseDetails.documents?.map((doc) => (
              <div
                key={doc.id}
                className="p-3 border bg-primary/5 border-primary/10 rounded-lg flex items-center gap-4"
              >
                <div className="p-2 bg-white rounded-lg border border-primary/15">
                  <FileText className="size-4 text-red-400" />
                </div>

                <div>
                  <p className="text-[12.5px] font-medium text-gray-800 truncate">
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {doc.size_bytes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
