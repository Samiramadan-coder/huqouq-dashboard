"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string | number | string[];
};

type NormalFormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  control: Control<T>;
  options: SelectOption[];
  groupLabel?: string;
  className?: string;
  triggerClassName?: string;
  dir?: string;
  disabled?: boolean;
};

export default function NormalFormSelect<T extends FieldValues>({
  name,
  label,
  placeholder = "Choose",
  required,
  control,
  options,
  groupLabel,
  className,
  triggerClassName,
  dir = "ltr",
  disabled = false,
}: NormalFormSelectProps<T>) {
  function getOptionValue(value: string) {
    const selectedOption = options.find(
      (option) => String(option.value) === value,
    );

    return selectedOption?.value ?? value;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
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

          <FieldContent>
            <div className="space-y-1.5">
              <Select
                disabled={disabled}
                value={
                  field.value === undefined ||
                  field.value === null ||
                  field.value === 0
                    ? ""
                    : String(field.value)
                }
                onValueChange={(value) => field.onChange(getOptionValue(value))}
              >
                <SelectTrigger
                  id={name}
                  aria-invalid={fieldState.invalid}
                  dir={dir}
                  className={cn(
                    "h-10 min-h-10 w-full border-border bg-background",
                    triggerClassName,
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}

                    {options.map((option) => (
                      <SelectItem
                        key={String(option.value)}
                        value={String(option.value)}
                        dir={dir}
                        className={cn({
                          "font-cairo!": dir === "rtl",
                          "font-inter!": dir !== "ltr",
                        })}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <FieldError errors={[fieldState.error]} />
            </div>
          </FieldContent>
        </Field>
      )}
    />
  );
}
