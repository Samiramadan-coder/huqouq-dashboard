import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { SheetTrigger } from "../ui/sheet";

export default function AddButton({ label }: { label: string }) {
  return (
    <SheetTrigger asChild>
      <Button variant="default" className="h-10 px-4 text-black">
        <Plus className="mr-2" />
        {label}
      </Button>
    </SheetTrigger>
  );
}
