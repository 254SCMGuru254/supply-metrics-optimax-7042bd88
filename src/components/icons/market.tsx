
import { LucideIconProps } from "lucide-react";

export const Market = ({ size = 24, ...props }: LucideIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 3h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M20 7v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7" />
    <path d="M15 3v4" />
    <path d="M7 3v4" />
    <path d="M11 3v4" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
  </svg>
);
