import React, { useState, useEffect } from "react";

/**
 *
 * @name ImageWithFallback
 * @description A simple image component with a fallback image.
 * @param {Object} props - The props object.
 * @param {String} props.src - The image source URL.
 * @param {String} props.alt - The image alt text.
 * @param {String} props.className - The image class name.
 * @returns {JSX.Element} The ImageWithFallback component.
 *
 */

function ImageWithFallback({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (src) {
      setImgSrc(src);
    } else {
      setImgSrc(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHOjsKSJVdki65NV_SN4HBcEqL3_I6uhqU_g&s"
      );
    }
  }, [src]);

  const handleError = () => {
    setImgSrc(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHOjsKSJVdki65NV_SN4HBcEqL3_I6uhqU_g&s"
    );
  };

  return (
    <div className="flex items-center justify-center p-4 max-h-[226px]">
      <img
        src={imgSrc}
        alt={alt}
        className={`object-contain  max-h-[226px] rounded-t-md ${className} `}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}

export default ImageWithFallback;
