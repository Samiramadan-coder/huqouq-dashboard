import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

// Downloads an attachment through the app's proxy route, which adds the
// HTTP-only token on the server.
export default function DownloadFile({ id, name }: { id: number; name: string }) {
  const t = useTranslations("LegalServicesApprovals.Details");

  return (
    <Button size="icon" variant="ghost" asChild>
      <a
        href={`/api/legal-service-files/${id}`}
        download={name}
        aria-label={t("download", { name })}
      >
        <ExternalLink />
      </a>
    </Button>
  );
}
