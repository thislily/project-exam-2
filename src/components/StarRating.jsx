import { Star, StarHalf, Star as StarOutline } from "lucide-react";

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) => (
        index < fullStars ? (
          <Star key={index} className="text-yellow-400 w-6 h-6" fill="#FFD700" />
        ) : hasHalfStar && index === fullStars ? (
          <StarHalf key={index} className="text-yellow-400 w-6 h-6" fill="#FFD700" />
        ) : (
          <StarOutline key={index} className="text-gray-300 w-6 h-6" />
        )
      ))}
    </div>
  );
}

export default StarRating;
