import {
  Select,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../ui/select";

export default function QuerySelect({
  placeholder,
  className,
  options,
}: {
  placeholder: string;
  className?: string;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <Select>
      <SelectTrigger
        className={`
          bg-white 
          min-h-9! 
          border-gray-200 
          data-placeholder:text-gray-400! 
          data-placeholder:text-[13px]! 
          ${className}
        `}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
