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
  value,
  onChange,
}: {
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
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`
          text-[13px]
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
