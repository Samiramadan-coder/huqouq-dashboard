import { Star } from "lucide-react";

type RatingProps = {
  rating: number;
  count?: number;
  max?: number;
  size?: number;
};

export function Rating({ rating, count, max = 5, size = 16 }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-primary gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const filled = rating >= index + 1;
          const half = rating > index && rating < index + 1;

          return (
            <span key={index} className="relative inline-flex">
              <Star size={size} className="text-primary" />

              {(filled || half) && (
                <Star
                  size={size}
                  className="absolute inset-0 fill-current text-primary"
                  style={{
                    clipPath: half ? "inset(0 50% 0 0)" : "none",
                  }}
                />
              )}
            </span>
          );
        })}
      </div>

      {typeof count === "number" && (
        <span className="ms-2 text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
