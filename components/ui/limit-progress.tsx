import { Progress } from "@/components/ui/progress";

type LimitProgressProps = {
  value: number;
  limit: number;
};

export default function LimitProgress({ value, limit }: LimitProgressProps) {
  const percentage = limit > 0 ? Math.min((value / limit) * 100, 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span>
          {value} / {limit}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>

      <Progress value={percentage} className="h-2" />
    </div>
  );
}
