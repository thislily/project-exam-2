import React from "react";

/**
 * @name LocationForm
 * @description A simple location form component.
 * @param {Object} props - The props object.
 * @param {Object} props.locationData - The location data object.
 * @param {Function} props.onChange - The function to run when the location data changes.
 * @returns {JSX.Element} The LocationForm component.
 *
 */

const LocationForm = ({ locationData, onChange }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mt-4 text-black">Location</h3>
      <div className="mb-4">
        <label htmlFor="address" className="block mb-1 text-black">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={locationData.address}
          onChange={onChange}
          className="p-2 w-full rounded-md border border-gray-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="city" className="block mb-1 text-black">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={locationData.city}
          onChange={onChange}
          className="p-2 w-full rounded-md border border-gray-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="country" className="block mb-1 text-black">
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={locationData.country}
          onChange={onChange}
          className="p-2 w-full rounded-md border border-gray-500"
        />
      </div>
    </div>
  );
};

export default LocationForm;
