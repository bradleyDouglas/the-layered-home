import { Link } from "next-transition-router";
import cn from "@/utils/cn";

export default function Cta({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "uppercase text-xs font-medium tracking-widest flex items-center gap-2 text-graphite lg:hover:text-faded-copper transition-colors duration-300",
        className
      )}
    >
      {label}
      <svg
        width="23"
        height="6"
        viewBox="0 0 23 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23 2.88678L18 2.84392e-05V5.77353L23 2.88678ZM0 2.88678V3.38678H18.5V2.88678V2.38678H0V2.88678Z"
          fill="currentColor"
        />
      </svg>
    </Link>
  );
}
