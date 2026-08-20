import { Pencil } from "lucide-react";
import { Button } from "../ui/button";

export default function EditBtn(props: React.ComponentProps<typeof Button>) {
  return (
    <Button type="button" variant="ghost" {...props}>
      <Pencil className="text-muted-foreground" />
    </Button>
  );
}
