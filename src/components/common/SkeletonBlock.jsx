import React from "react";

// Reusable skeleton primitive. Subtle pulsing block tinted to match the
// glass-panel aesthetic. Pass explicit `width`/`height` for pixel values, or
// drive sizing via Tailwind utilities on `className` (e.g. "h-28 w-full").
const SkeletonBlock = ({ width, height, className = "", rounded = "rounded-lg" }) => {
  const style = {};
  if (width !== undefined) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }
  if (height !== undefined) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-white/5 ${rounded} ${className}`}
      style={style}
    />
  );
};

export default SkeletonBlock;
