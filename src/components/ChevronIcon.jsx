import React from 'react';

function ChevronIcon({ direction }) {
  return (
    <svg
      width="13"
      height="21"
      viewBox="0 0 13 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transform ${direction === 'left' ? 'rotate-180' : ''}`}
    >
      <path
        d="M2 2L11 10.5L2 19"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChevronIcon;