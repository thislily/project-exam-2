import React from "react";

function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white hover:bg-breeze text-black border-breeze border-4 font-heading font-semibold p-4 px-6 rounded-md"
    >
      {text}
    </button>
  );
}

export default Button;
