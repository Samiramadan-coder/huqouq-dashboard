"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { CaseDocument } from "@/types/case-approvals";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;

// Attached documents with an in-page preview. The iframe is only mounted while
// the preview dialog is open, so large files never block the page.
export default function CaseDocuments({
  documents,
}: {
  documents: CaseDocument[];
}) {
  const format = useFormatter();
  const t = useTranslations("CaseApprovals.Details");
  const [selectedDocument, setSelectedDocument] = useState<CaseDocument | null>(
    null,
  );

  function formatSize(bytes: number) {
    const [value, unit] =
      bytes >= BYTES_PER_MB
        ? [bytes / BYTES_PER_MB, "megabyte"]
        : [bytes / BYTES_PER_KB, "kilobyte"];

    return format.number(value, {
      style: "unit",
      unit,
      maximumFractionDigits: 1,
    });
  }

  if (!documents.length) {
    return (
      <p className="p-4 text-[12.5px] text-gray-400">{t("noDocuments")}</p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {documents.map((doc) => (
          <li key={doc.id}>
            <button
              type="button"
              onClick={() => setSelectedDocument(doc)}
              aria-label={t("previewDocument", { name: doc.name })}
              className="w-full text-start cursor-pointer p-3 border bg-primary/5 border-primary/10 rounded-lg flex items-center gap-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <div className="p-2 bg-white rounded-lg border border-primary/15">
                <FileText className="size-4 text-red-400" />
              </div>

              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-gray-800 truncate">
                  {doc.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {formatSize(doc.size_bytes)}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={!!selectedDocument}
        onOpenChange={(open) => {
          if (!open) setSelectedDocument(null);
        }}
      >
        <DialogContent className="sm:max-w-7xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.name ?? t("documentPreview")}
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <iframe
              src={selectedDocument.url}
              title={selectedDocument.name}
              referrerPolicy="no-referrer"
              className="w-full h-[75vh] rounded-lg border border-primary/15"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
