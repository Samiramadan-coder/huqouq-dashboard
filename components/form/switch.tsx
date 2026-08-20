"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";

import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";

type NormalFormSwitchProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

export default function NormalFormSwitch<T extends FieldValues>({
  name,
  label,
  description,
  control,
  className,
  labelClassName,
  descriptionClassName,
}: NormalFormSwitchProps<T>) {
  const switchId = `switch-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          className={className}
          data-invalid={fieldState.invalid}
        >
          <Switch
            id={switchId}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />

          <FieldContent>
            <FieldLabel
              htmlFor={switchId}
              className={cn("text-sm font-semibold", labelClassName)}
            >
              {label}
            </FieldLabel>

            {description && (
              <FieldDescription
                className={cn(
                  "text-sm text-muted-foreground",
                  descriptionClassName,
                )}
              >
                {description}
              </FieldDescription>
            )}

            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  );
}
