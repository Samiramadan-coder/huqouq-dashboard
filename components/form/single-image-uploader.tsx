"use client";

import {
  Controller,
  type Path,
  type Control,
  type FieldValues,
} from "react-hook-form";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { useTranslations } from "next-intl";

type ImageValue = string | Blob | null;

type SingleFormImageUploaderProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
  accept?: string;
};

export default function SingleFormImageUploader<T extends FieldValues>({
  name,
  control,
  label,
  required,
  className,
  accept = "image/*",
}: SingleFormImageUploaderProps<T>) {
  const t = useTranslations("Common");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedImage = (field.value ?? null) as ImageValue;

        const imageUrl =
          typeof selectedImage === "string"
            ? selectedImage
            : selectedImage instanceof Blob
              ? URL.createObjectURL(selectedImage)
              : null;

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {label && (
              <FieldLabel
                className={cn(
                  "text-sm font-semibold",
                  required &&
                    "after:ms-1 after:text-destructive after:content-['*']",
                )}
              >
                {label}
              </FieldLabel>
            )}

            <FieldContent>
              <div className="space-y-2">
                <div className="rounded-lg border border-dashed border-border bg-primary/10 p-4">
                  {imageUrl ? (
                    <div className="relative overflow-hidden rounded-lg border border-border">
                      <Image
                        src={imageUrl}
                        alt="Selected image"
                        width={400}
                        height={400}
                        className="h-35 w-full object-cover"
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute inset-e-2 top-2 size-7"
                        onClick={() => {
                          field.onChange("");

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex h-35 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-3 text-muted-foreground transition duration-150 hover:border-2 hover:border-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="size-6" />
                      <Plus className="size-4" />
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      field.onChange(file);
                      event.target.value = "";
                    }}
                  />
                </div>

                <FieldError errors={[fieldState.error]} />
              </div>
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
