import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const avatarColors = [
  "bg-purple-500",
  "bg-secondary",
  "bg-orange-600",
  "bg-primary",
  "bg-emerald-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function LawyerAvatar({
  lawyer,
}: {
  lawyer: { id: number; name: string; photo_url: string | null };
}) {
  return (
    <Avatar className="size-8">
      {lawyer.photo_url && (
        <AvatarImage src={lawyer.photo_url} alt={lawyer.name} />
      )}
      <AvatarFallback
        className={cn(
          "text-white text-[12px] font-semibold",
          avatarColors[lawyer.id % avatarColors.length],
        )}
      >
        {getInitials(lawyer.name)}
      </AvatarFallback>
    </Avatar>
  );
}
