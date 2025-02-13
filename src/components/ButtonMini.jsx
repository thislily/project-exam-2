import React from "react";

function ButtonMini({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white hover:bg-breeze text-black border-breeze border-4 font-heading font-semibold p-1 px-2 mb-1 rounded-md"
    >
      {text}
    </button>
  );
}

export default ButtonMini;
