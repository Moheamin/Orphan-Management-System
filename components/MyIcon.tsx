import React from "react";

interface MyIconProps {
  size?: number; // Optional size in pixels
  shape?: "circle" | "rounded" | "square"; // Strict types prevent errors
  color?: string; // Can be a hex color or a CSS variable
  children?: React.ReactNode;
  className?: string; // For extra responsive tweaks
}

export default function MyIcon({
  size = 48,
  shape = "rounded",
  color = "var(--primeColor)",
  children,
  className = "",
}: MyIconProps) {
  // Logic for border radius
  const radiusMap = {
    circle: "rounded-full",
    rounded: "rounded-[25%]",
    square: "rounded-none",
  };

  return (
    <div
      className={`flex items-center justify-center shrink-0 transition-transform active:scale-95 ${radiusMap[shape]} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
      }}
    >
      {/* Scale children icons automatically based on container size 
         We ensure the child (usually a Lucide icon) doesn't exceed 50-60% of the box
      */}
      <div className="flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </div>
  );
}
