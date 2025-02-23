import React from "react";

const ImageGallery = ({
  media,
  newImageUrl,
  newImageAlt,
  onNewImageUrlChange,
  onNewImageAltChange,
  onAddImage,
  onRemoveImage,
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mt-4 text-black">Images</h3>
      <div className="mb-4 w-full">
        <label htmlFor="newImageUrl" className="block mb-1 text-black">
          Image URL
        </label>
        <input
          type="text"
          id="newImageUrl"
          value={newImageUrl}
          onChange={onNewImageUrlChange}
          className="p-2 w-full rounded-md border border-gray-500"
        />
      </div>
      <div className="mb-4 w-full">
        <label htmlFor="newImageAlt" className="block mb-1 text-black">
          Image Description
        </label>
        <input
          type="text"
          id="newImageAlt"
          value={newImageAlt}
          onChange={onNewImageAltChange}
          className="p-2 w-full rounded-md border border-gray-500"
        />
      </div>
      <button
        type="button"
        onClick={onAddImage}
        className="p-3 bg-gray-300 rounded-md mb-4"
      >
        Add image
      </button>
      {media.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {media.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.url}
                alt={img.alt}
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
