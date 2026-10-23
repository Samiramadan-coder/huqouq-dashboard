import {
  Select,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../ui/select";
import { cn } from "@/lib/utils";

// Radix Select rejects empty-string item values, so "" (no filter) is mapped
// to this sentinel internally and back to "" for callers.
const EMPTY_VALUE = "__all__";

export default function QuerySelect({
  label,
  placeholder,
  className,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  className?: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      value={value === "" ? EMPTY_VALUE : value}
      onValueChange={(next) => onChange(next === EMPTY_VALUE ? "" : next)}
    >
      <SelectTrigger
        aria-label={label}
        className={cn(
          "text-[13px] bg-white min-h-9! border-gray-200 data-placeholder:text-gray-400! data-placeholder:text-[13px]!",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value || EMPTY_VALUE}
              value={option.value || EMPTY_VALUE}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
