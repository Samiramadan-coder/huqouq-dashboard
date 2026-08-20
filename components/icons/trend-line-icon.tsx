type TrendLineIconProps = {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export default function TrendLineIcon({
  size,
  width = 80,
  height = 32,
  color = "var(--primary)",
  strokeWidth = 1.5,
  className,
}: TrendLineIconProps) {
  return (
    <svg
      width={size ?? width}
      height={size ? size * 0.4 : height}
      viewBox="0 0 80 32"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <polyline
        points="2 25.82089552238806 14.666666666666666 19.55223880597015 27.333333333333332 30 40 11.194029850746269 52.666666666666664 4.925373134328359 65.33333333333333 13.283582089552239 78 2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
