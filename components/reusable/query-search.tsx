import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
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
      className={`bg-white min-h-9! border-gray-200 px-2 ${className || ""}`}
    >
      <InputGroupInput
        placeholder={placeholder}
        className="placeholder:text-gray-400 placeholder:text-[13px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search className="size-4 text-gray-400" />
      </InputGroupAddon>
    </InputGroup>
  );
}
