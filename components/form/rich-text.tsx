"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";

import { cn } from "@/lib/utils";
import { RichTextEditor } from "../ui/rich-text-editor";

type NormalFormRichTextProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  control: Control<T>;
  className?: string;
};

export default function NormalFormRichText<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  control,
  className,
}: NormalFormRichTextProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel
              htmlFor={name}
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
            <div className="space-y-1.5">
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={placeholder}
              />

              <FieldError errors={[fieldState.error]} />
            </div>
          </FieldContent>
        </Field>
      )}
    />
  );
}
