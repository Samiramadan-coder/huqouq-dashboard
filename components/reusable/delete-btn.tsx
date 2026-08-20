"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";

export default function DeleteBtn({
  onDelete,
  loading,
}: {
  loading?: boolean;
  onDelete?: () => Promise<void>;
}) {
  const t = useTranslations("Common");
  const closeBtn = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    await onDelete?.();
    closeBtn.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 className="text-red-400" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogClose asChild>
          <Button className="hidden" ref={closeBtn}></Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-red-600">{t("Delete")}</DialogTitle>
          <DialogDescription>{t("DeleteConfirmation")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            {loading ? <Spinner /> : t("Confirmation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
