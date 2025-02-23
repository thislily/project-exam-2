import React from 'react';

function InputField({ label, id, type, required }) {
  const inputClasses = "p-2 mb-2 w-full h-10 rounded-md border border-gray-500 border-solid";
  const textareaClasses = "p-2 mb-3.5 w-full rounded-md border border-gray-500 border-solid resize-none h-[73px]";

  return (
    <div className="mb-2">
      <label htmlFor={id} className="mb-1 text-base text-black block">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          className={textareaClasses}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={id}
          className={inputClasses}
          required={required}
        />
      )}
    </div>
  );
}

export default InputField;