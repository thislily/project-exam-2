import React from "react";

function Loader() {
  return (
    <div className="flex items-center justify-center">
      {/* Spinner */}
      <div className="w-8 h-8 border-4 border-sunbeam border-t-transparent rounded-full animate-spin"></div>
      {/* Loading Text */}
      <span className="ml-2 text-harbour font-semibold">Loading...</span>
    </div>
  );
}

export default Loader;
