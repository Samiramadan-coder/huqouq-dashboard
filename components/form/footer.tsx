import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { SheetClose, SheetFooter } from "../ui/sheet";
import { Spinner } from "../ui/spinner";

export default function FormFooter({
  form,
  loading,
}: {
  form: React.RefObject<HTMLFormElement | null>;
  loading?: boolean;
}) {
  const t = useTranslations("Common");

  return (
    <SheetFooter className="mt-4 border-t border-border bg-white px-4 py-3">
      <div className="flex items-center justify-end gap-2">
        <SheetClose asChild>
          <Button type="button" variant="outline" className="h-10 flex-1">
            {t("Cancel")}
          </Button>
        </SheetClose>
        <Button
          type="submit"
          className="h-10 flex-1"
          onClick={() => form.current?.requestSubmit()}
          disabled={loading}
        >
          {loading ? <Spinner /> : t("Save")}
        </Button>
      </div>
    </SheetFooter>
  );
}
