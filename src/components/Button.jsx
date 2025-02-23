import React from "react";

/**
 *  
 * @name Button
 * @description A button component.
 * @param {Object} props - The props object.
 * @param {string} props.text - The text to display on the button.
 * @param {Function} props.onClick - The function to run when the button is clicked.
 * @param {string} props.className - The class name to apply to the button.
 * @returns {JSX.Element} The Button component.
 * 
 */

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
