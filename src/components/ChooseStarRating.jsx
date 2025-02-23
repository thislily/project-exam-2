import React, { useState } from "react";
import { Star } from "lucide-react";

/**
 * 
 * @name ChooseStarRating
 * @description A star rating component.
 * @param {Object} props - The props object.
 * @param {String} props.label - The label for the star rating.
 * @param {Function} props.onChange - The function to run when the rating changes.
 * @returns {JSX.Element} The ChooseStarRating component.
 * 
 */ 

function ChooseStarRating({ label, onChange }) {
  const [rating, setRating] = useState(0);

  const handleClick = (star) => {
    setRating(star);
    if (onChange) {
      onChange(star);
    }
  };

  return (
    <div>
      {label && <label className="block mb-1">{label}</label>}
      <div className="flex justify-center" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            className="mr-1.5 focus:outline-none"
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className="w-6 h-6"
              fill={rating >= star ? "#FFC857" : "none"}
              stroke={rating >= star ? "#FFC857" : "#ccc"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChooseStarRating;
