"use client";

import type { ReactNode } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

import {
  get,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

type NormalFormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  className?: string;
  inputClassName?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  description?: ReactNode;
};

export default function NormalFormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  register,
  errors,
  className,
  inputClassName,
  type = "text",
  disabled = false,
  prefix,
  suffix,
  description,
}: NormalFormInputProps<T>) {
  const error = get(errors, name);

  const inputRegister =
    type === "number"
      ? register(name, {
          valueAsNumber: true,
        })
      : register(name);

  const hasAddon = Boolean(prefix || suffix);

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
          {hasAddon ? (
            <div
              className={cn(
                "flex h-10 overflow-hidden rounded-md border border-border bg-background",
                "focus-within:ring-ring/50 focus-within:border-ring focus-within:ring-[3px]",
                error && "border-destructive focus-within:ring-destructive/20",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {prefix && (
                <div className="flex items-center border-e border-border bg-muted/40 px-3 text-xs text-muted-foreground">
                  {prefix}
                </div>
              )}

              <Input
                {...inputRegister}
                id={name}
                type={type}
                placeholder={placeholder}
                aria-invalid={!!error}
                disabled={disabled}
                className={cn(
                  "h-full min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  inputClassName,
                )}
              />

              {suffix && (
                <div className="flex items-center border-s border-border bg-muted/40 px-3 text-xs text-muted-foreground">
                  {suffix}
                </div>
              )}
            </div>
          ) : (
            <Input
              {...inputRegister}
              id={name}
              type={type}
              placeholder={placeholder}
              aria-invalid={!!error}
              disabled={disabled}
              className={cn("h-10 border-border bg-background", inputClassName)}
            />
          )}
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError errors={[error]} />
        </div>
      </FieldContent>
    </Field>
  );
}
