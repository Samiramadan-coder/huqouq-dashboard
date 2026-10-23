import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function QuerySearch({
  placeholder,
  className,
  value,
  onChange,
}: {
  placeholder: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup
      className={cn("bg-white min-h-9! border-gray-200 px-2", className)}
    >
      <InputGroupInput
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        className="placeholder:text-gray-400 placeholder:text-[13px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search aria-hidden className="size-4 text-gray-400" />
      </InputGroupAddon>
    </InputGroup>
  );
}
