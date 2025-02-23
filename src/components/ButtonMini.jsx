import React from "react";

function ButtonMini({ text, onClick, className = "" }) {
  // Default classes applied to the button
  const defaultClasses =
    "bg-white border-4 font-heading font-semibold p-1 px-2 mb-1 rounded-md";

  return (
    <button onClick={onClick} className={`${defaultClasses} ${className}`}>
      {text}
    </button>
  );
}

export default ButtonMini;
