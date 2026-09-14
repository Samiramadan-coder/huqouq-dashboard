import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";

export default function QuerySearch({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <InputGroup
      className={`bg-white min-h-9! border-gray-200 px-2 ${className || ""}`}
    >
      <InputGroupInput
        placeholder={placeholder}
        className="placeholder:text-gray-400 placeholder:text-[13px]"
      />
      <InputGroupAddon>
        <Search className="size-4 text-gray-400" />
      </InputGroupAddon>
    </InputGroup>
  );
}
