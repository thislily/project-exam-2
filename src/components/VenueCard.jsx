import React from "react";
import ImageWithFallback from "./ImageWithFallback"; // Ensure this component is in your project
import StarRating from "./StarRating";

function VenueCard({ venue }) {
  // Ensure that venue and media are present at the top level
  if (!venue || !venue.media || venue.media.length === 0) {
    return <div>No media available</div>;
  }

  // Use the first image in the array
  const firstImage = venue.media[0]; // Access the first image in the media array

  // Ensure the first image is defined and contains a valid URL
  if (!firstImage || !firstImage.url) {
    return <div>Image not available</div>;
  }

  return (
    <div className="flex flex-col rounded-md max-w-[390px] h-[460px] shadow-md">
  <div className="flex flex-col pb-7 w-full bg-white rounded-md flex-grow">
    <div className="flex relative flex-col justify-center px-6 py-28 w-full rounded-md aspect-[1.667]">
      {/* Display the first image */}
      <ImageWithFallback
        src={firstImage.url} // Use the first image URL
        alt={firstImage.alt || "Venue Image"} // Use alt text if available, otherwise fallback to default
        className="object-cover absolute inset-0 size-full"
      />
    </div>

    {/* This div needs to expand to push the price div down */}
    <div className="flex flex-col justify-between px-6 mt-2.5 w-full flex-grow">
      <div className="flex-grow">
        <h2 className="self-start text-xl font-bold max-w-full text-zinc-800 break-words hyphens-auto line-clamp-2">
          {venue.name}
        </h2>
        <p className="mt-2 text-base leading-7 text-zinc-700 max-w-full break-words hyphens-auto line-clamp-3">
          {venue.description}
        </p>
      </div>

      {/* Price div stays at the bottom */}
      <div className="flex gap-5 justify-between">
        {/* Display the star rating */}
        <StarRating rating={venue.rating} />
        <div className="text-xl font-bold leading-tight text-black">
          ${venue.pricePerNight} per night
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default VenueCard;
