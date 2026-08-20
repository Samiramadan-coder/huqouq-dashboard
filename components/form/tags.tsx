"use client";

import {
  type ClipboardEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { X } from "lucide-react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type NormalFormTagsInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  maxTags?: number;
};

export default function NormalFormTagsInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Type then press Enter",
  required,
  disabled = false,
  description,
  className,
  inputClassName,
  maxTags,
}: NormalFormTagsInputProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const values = Array.isArray(field.value)
          ? (field.value as string[])
          : [];

        const addTag = (newValue: string) => {
          const tag = newValue.trim();

          if (!tag) return;

          const exists = values.some(
            (item) => item.toLowerCase() === tag.toLowerCase(),
          );

          if (exists) {
            setInputValue("");
            return;
          }

          if (maxTags && values.length >= maxTags) {
            return;
          }

          field.onChange([...values, tag]);
          setInputValue("");
        };

        const removeTag = (indexToRemove: number) => {
          field.onChange(values.filter((_, index) => index !== indexToRemove));
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addTag(inputValue);
            return;
          }

          if (
            event.key === "Backspace" &&
            inputValue === "" &&
            values.length > 0
          ) {
            removeTag(values.length - 1);
          }
        };

        const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
          const pastedText = event.clipboardData.getData("text");

          if (!pastedText.includes(",") && !pastedText.includes("\n")) {
            return;
          }

          event.preventDefault();

          const pastedTags = pastedText
            .split(/[,\n]/)
            .map((item) => item.trim())
            .filter(Boolean);

          const nextTags = [...values];

          pastedTags.forEach((tag) => {
            const exists = nextTags.some(
              (item) => item.toLowerCase() === tag.toLowerCase(),
            );

            if (!exists) {
              nextTags.push(tag);
            }
          });

          field.onChange(maxTags ? nextTags.slice(0, maxTags) : nextTags);

          setInputValue("");
        };

        return (
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
                <div
                  onClick={() => inputRef.current?.focus()}
                  className={cn(
                    "flex min-h-10 w-full flex-wrap items-center gap-2",
                    "rounded-md border border-border bg-background px-3 py-1.5",
                    "transition-[color,box-shadow]",
                    "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
                    fieldState.invalid &&
                      "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
                    disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {values.map((tag, index) => (
                    <Badge
                      key={`${tag}-${index}`}
                      className="h-6 gap-1 rounded-md px-2 text-xs text-foreground"
                    >
                      <span className="max-w-40 truncate">{tag}</span>

                      <button
                        type="button"
                        disabled={disabled}
                        aria-label={`Remove ${tag}`}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeTag(index);
                        }}
                        className="rounded-sm text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}

                  <Input
                    ref={inputRef}
                    id={name}
                    name={field.name}
                    value={inputValue}
                    disabled={disabled}
                    aria-invalid={fieldState.invalid}
                    placeholder={values.length === 0 ? placeholder : ""}
                    onBlur={field.onBlur}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    onChange={(event) => setInputValue(event.target.value)}
                    className={cn(
                      "h-7 min-w-28 flex-1 rounded-none border-0 bg-transparent p-0 shadow-none",
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      "aria-invalid:border-0 aria-invalid:ring-0",
                      inputClassName,
                    )}
                  />
                </div>

                {description && (
                  <FieldDescription>{description}</FieldDescription>
                )}

                <FieldError errors={[fieldState.error]} />
              </div>
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
