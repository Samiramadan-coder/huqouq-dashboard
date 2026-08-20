"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { cn } from "@/lib/utils";

type NormalFormDayMonthPickerProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  required?: boolean;
  className?: string;
  triggerClassName?: string;
  monthPlaceholder?: string;
  dayPlaceholder?: string;
};

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getDaysInMonth(month: string) {
  const monthNumber = Number(month);

  if (!monthNumber) return 31;

  return new Date(2024, monthNumber, 0).getDate();
}

function splitValue(value?: string) {
  const [month, day] = value?.split("-") ?? [];

  return {
    month: month || "",
    day: day || "",
  };
}

export default function NormalFormDayMonthPicker<T extends FieldValues>({
  name,
  label,
  control,
  required,
  className,
  triggerClassName,
  monthPlaceholder = "Month",
  dayPlaceholder = "Day",
}: NormalFormDayMonthPickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { month, day } = splitValue(field.value);

        const daysCount = getDaysInMonth(month);

        const days = Array.from({ length: daysCount }, (_, index) => {
          const dayValue = String(index + 1).padStart(2, "0");

          return {
            value: dayValue,
            label: dayValue,
          };
        });

        function handleMonthChange(nextMonth: string) {
          const currentDay = Number(day);
          const maxDay = getDaysInMonth(nextMonth);

          const nextDay = String(
            currentDay && currentDay <= maxDay ? currentDay : 1,
          ).padStart(2, "0");

          field.onChange(`${nextMonth}-${nextDay}`);
        }

        function handleDayChange(nextDay: string) {
          const nextMonth = month || "01";

          field.onChange(`${nextMonth}-${nextDay}`);
        }

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={`${name}-month`}
              className={cn(
                "text-xs font-semibold",
                required &&
                  "after:ms-1 after:text-destructive after:content-['*']",
              )}
            >
              {label}
            </FieldLabel>

            <FieldContent>
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <Select value={month} onValueChange={handleMonthChange}>
                    <SelectTrigger
                      id={`${name}-month`}
                      aria-invalid={fieldState.invalid}
                      className={cn(
                        "h-10 min-h-10 w-full border-border bg-background",
                        triggerClassName,
                      )}
                    >
                      <SelectValue placeholder={monthPlaceholder} />
                    </SelectTrigger>

                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={day} onValueChange={handleDayChange}>
                    <SelectTrigger
                      id={`${name}-day`}
                      aria-invalid={fieldState.invalid}
                      className={cn(
                        "h-10 min-h-10 w-full border-border bg-background",
                        triggerClassName,
                      )}
                    >
                      <SelectValue placeholder={dayPlaceholder} />
                    </SelectTrigger>

                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
