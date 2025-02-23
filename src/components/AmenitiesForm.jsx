import React from "react";

const AmenitiesForm = ({ meta, onChange }) => {
  const amenities = ["wifi", "parking", "breakfast", "pets"];
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mt-4 text-black">Amenities</h3>
      {amenities.map((key) => (
        <div key={key} className="flex items-center mt-2">
          <input
            type="checkbox"
            id={key}
            name={key}
            checked={meta[key]}
            onChange={onChange}
            className="mr-2"
          />
          <label htmlFor={key} className="text-black">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        </div>
      ))}
    </div>
  );
};

export default AmenitiesForm;

