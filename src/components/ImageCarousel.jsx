import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 *
 * @name ImageCarousel
 * @description A simple image carousel component.
 * @param {Object} props - The props object.
 * @param {Array} props.images - An array of image objects.
 * @returns {JSX.Element} The ImageCarousel component.
 *
 */

function ImageCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const totalImages = images.length;
  const currentImage = images[currentIndex] || {}; // safety fallback

  //eslint-disable-next-line
  const handlePrev = (e) => {
    e?.stopPropagation?.();
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  //eslint-disable-next-line
  const handleNext = (e) => {
    e?.stopPropagation?.();
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  // Always call the effect, no matter how many images
  useEffect(() => {
    function onKeyDown(e) {
      switch (e.key) {
        case "ArrowLeft": {
          if (totalImages > 1) handlePrev();
          break;
        }
        case "ArrowRight": {
          if (totalImages > 1) handleNext();
          break;
        }
        case "Escape": {
          if (lightboxOpen) closeLightbox();
          break;
        }
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handlePrev, lightboxOpen, totalImages]);

  // If no images, display a fallback in the JSX (after the effect is declared)
  if (!totalImages) {
    return (
      <div className="relative w-full h-[500px] bg-gray-300 flex items-center justify-center rounded-t-xl max-md:h-[300px]">
        <p className="text-white font-semibold">No images available</p>
      </div>
    );
  }

  // Otherwise, display the normal carousel
  return (
    <div className="relative w-full h-[500px] bg-white rounded-t-xl max-md:h-[300px] overflow-hidden shadow-md">
      {/* Main Image */}
      <img
        src={currentImage.url}
        alt={currentImage.alt || "Image"}
        className="object-cover w-full h-full cursor-pointer"
        onClick={openLightbox}
      />

      {/* Navigation Buttons (hide if only one image) */}
      {totalImages > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex justify-between px-8 max-md:px-4">
          <button
            aria-label="Previous image"
            onClick={handlePrev}
            className="bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors rounded-full p-3"
          >
            <ChevronLeft className="text-black" />
          </button>
          <button
            aria-label="Next image"
            onClick={handleNext}
            className="bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors rounded-full p-3"
          >
            <ChevronRight className="text-black" />
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          {/* Lightbox Container (90% height) */}
          <div
            className="relative w-[90vw] max-w-7xl h-[90vh] bg-white rounded-md overflow-hidden flex items-center justify-center "
            onClick={(e) => e.stopPropagation()}
          >
            {/* If multiple images, show next/prev arrows on top of the image */}
            {totalImages > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3"
                >
                  <ChevronLeft className="text-black" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3"
                >
                  <ChevronRight className="text-black" />
                </button>
              </>
            )}

            <img
              src={currentImage.url}
              alt={currentImage.alt || "Image"}
              className="object-cover h-full w-full"
            />

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3"
            >
              <X className="text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;
