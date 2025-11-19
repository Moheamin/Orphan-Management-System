// ...existing code...
import React from "react";
import "../src/index.css";
// ...existing code...

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  adj?: string; // or a union of allowed keys: 'primary' | 'secondary'
}

function Button({ children, onClick, adj }: ButtonProps) {
  return (
    <button onClick={onClick} className={`${adj}`}>
      {children}
    </button>
  );
}

export default Button;
// ...existing code...
