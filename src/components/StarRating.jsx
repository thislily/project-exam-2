import { Star, StarHalf, Star as StarOutline } from "lucide-react";

/**
 * @name StarRating
 * @description A simple star rating component.
 * @param {Object} props - The props object.
 * @param {Number} props.rating - The rating value.
 * @returns {JSX.Element} The StarRating component.
 *
 */

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) =>
        index < fullStars ? (
          <Star key={index} className="text-sunbeam w-6 h-6" fill="#FFC857" />
        ) : hasHalfStar && index === fullStars ? (
          <StarHalf
            key={index}
            className="text-sunbeam w-6 h-6"
            fill="#FFC857"
          />
        ) : (
          <StarOutline key={index} className="text-gray-300 w-6 h-6" />
        )
      )}
    </div>
  );
}

export default StarRating;
