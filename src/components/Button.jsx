import React from "react";

function Button({ text, onClick, className }) {
  const defaultClasses =
    "bg-white hover:bg-breeze text-black border-breeze border-4 font-heading font-semibold p-4 px-6 rounded-md";

  return (
    <button onClick={onClick} className={`${defaultClasses} ${className}`}>
      {text}
    </button>
  );
}

export default Button;
