import React from "react";
import "../src/index.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  adj?: string;
  type?: "button" | "submit" | "reset"; // Added for form compatibility
  disabled?: boolean; // Added for loading states
}

function Button({
  children,
  onClick,
  adj,
  type = "button",
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center 
        transition-all duration-200 
        active:scale-95 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${adj}
      `}
    >
      {children}
    </button>
  );
}

export default Button;
