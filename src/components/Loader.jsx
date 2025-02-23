import React from "react";

/**
 *
 * @name Loader
 * @description A simple loader component.
 * @returns {JSX.Element} The Loader component.
 *
 */

function Loader() {
  return (
    <div className="flex items-center justify-center pt-[100px]">
      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-sunbeam border-t-transparent rounded-full animate-spin"></div>
      {/* Loading Text */}
      <span className="ml-2 text-harbour font-semibold">Loading...</span>
    </div>
  );
}

export default Loader;
