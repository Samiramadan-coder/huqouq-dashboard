"use client";

// import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

export default function DownloadFile({
  id,
  token,
  name,
}: {
  id: number;
  token: string;
  name: string;
}) {
  // const t = useTranslations("Lawyer.LegalServices");

  async function downloadLegalServiceFile() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/legal-service-files/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();

    const contentDisposition = response.headers.get("content-disposition");

    let fileName = name || `file-${id}`;

    if (contentDisposition) {
      const match = contentDisposition.match(
        /filename\*?=(?:UTF-8''|")?([^";]+)/i,
      );

      if (match?.[1]) {
        fileName = decodeURIComponent(match[1].replace(/"/g, ""));
      }
    }

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <Button size="icon" variant="ghost" onClick={downloadLegalServiceFile}>
      <ExternalLink />
    </Button>
    // <button
    //   onClick={downloadLegalServiceFile}
    //   className="cursor-pointer text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
    // >
    //   {t("Details.download")}
    // </button>
  );
}
