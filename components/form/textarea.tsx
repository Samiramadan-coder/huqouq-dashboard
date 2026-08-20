"use client";

import type { ReactNode } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

import {
  get,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

type NormalFormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  className?: string;
  textareaClassName?: string;
  disabled?: boolean;
  description?: ReactNode;
  rows?: number;
  maxLength?: number;
};

export default function NormalFormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  register,
  errors,
  className,
  textareaClassName,
  disabled = false,
  description,
  rows = 4,
  maxLength,
}: NormalFormTextareaProps<T>) {
  const error = get(errors, name);

  return (
    <Field className={className} data-invalid={!!error}>
      {label && (
        <FieldLabel
          htmlFor={name}
          className={cn(
            "text-sm font-semibold",
            required && "after:ms-1 after:text-destructive after:content-['*']",
          )}
        >
          {label}
        </FieldLabel>
      )}

      <FieldContent>
        <div className="space-y-1.5">
          <Textarea
            {...register(name)}
            id={name}
            rows={rows}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-invalid={!!error}
            disabled={disabled}
            className={cn(
              "min-h-28 resize-y border-border bg-background",
              textareaClassName,
            )}
          />

          {description && <FieldDescription>{description}</FieldDescription>}

          <FieldError errors={[error]} />
        </div>
      </FieldContent>
    </Field>
  );
}
