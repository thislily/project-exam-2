import React, { useState, useEffect } from 'react';

function ImageWithFallback({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (src) {
      setImgSrc(src);
    } else {
      setImgSrc('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHOjsKSJVdki65NV_SN4HBcEqL3_I6uhqU_g&s');
    }
  }, [src]);

  const handleError = () => {
    setImgSrc('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHOjsKSJVdki65NV_SN4HBcEqL3_I6uhqU_g&s');
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
