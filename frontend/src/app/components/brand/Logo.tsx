import React from "react";
import { BRAND_CONFIG } from "./BrandConfig";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  variant?: "light" | "dark" | "white";
  className?: string;
  customText?: string;
}

/**
 * Modern Isometric Cube Logo inspired by the InternPath design identity.
 * Features layered cyan/teal and steel-blue facets for an enterprise 3D aesthetic.
 */
export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = ""
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="InternPath Logo Mark"
    >
      <defs>
        {/* Top Face Gradient */}
        <linearGradient id="ip-logo-top" x1="24" y1="4" x2="38" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#82d8eb" />
          <stop offset="100%" stopColor="#41b2cf" />
        </linearGradient>

        {/* Left Face Gradient */}
        <linearGradient id="ip-logo-left" x1="10" y1="20" x2="24" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#308ba6" />
          <stop offset="100%" stopColor="#1e5872" />
        </linearGradient>

        {/* Right Face Gradient */}
        <linearGradient id="ip-logo-right" x1="24" y1="20" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ebfd8" />
          <stop offset="100%" stopColor="#257591" />
        </linearGradient>

        {/* Inner Cutout Accent */}
        <linearGradient id="ip-logo-inner" x1="16" y1="12" x2="32" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c5eef7" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Top Isometric Facet */}
      <path
        d="M24 4L39 12.66V15.5L24 23.5L9 15.5V12.66L24 4Z"
        fill="url(#ip-logo-top)"
      />

      {/* Left Isometric Facet */}
      <path
        d="M9 17.5L23 25V42L9 34V17.5Z"
        fill="url(#ip-logo-left)"
      />

      {/* Right Isometric Facet */}
      <path
        d="M25 25L39 17.5V34L25 42V25Z"
        fill="url(#ip-logo-right)"
      />

      {/* Inner Dynamic Chevron / Pathway */}
      <path
        d="M24 13L32 17.5L24 22L16 17.5L24 13Z"
        fill="url(#ip-logo-inner)"
      />
      <path
        d="M24 22V31"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 32,
  showWordmark = true,
  variant = "light",
  className = "",
  customText
}) => {
  const brandName = customText || BRAND_CONFIG.name;

  const textColorClass =
    variant === "white"
      ? "text-white"
      : variant === "dark"
      ? "text-[#1b3b52]"
      : "text-[#244e6e]";

  const editionColorClass =
    variant === "white"
      ? "text-[#9ee3f2]"
      : "text-[#3488a6]";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon size={size} />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={`text-[17px] font-bold tracking-tight ${textColorClass}`}>
            {brandName}
          </span>
          <span className={`text-[9px] uppercase tracking-wider font-semibold mt-0.5 ${editionColorClass}`}>
            {BRAND_CONFIG.edition}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
