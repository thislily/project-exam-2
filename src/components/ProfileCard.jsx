import React from "react";
import ButtonMini from "./ButtonMini";

/**
 * @name ProfileCard
 * @description A simple profile card component.
 * @param {Object} props - The props object.
 * @param {Object} props.profile - The profile object.
 * @param {Function} props.onEdit - The function to run when the edit button is clicked.
 * @param {Function} props.onUpgrade - The function to run when the upgrade button is clicked.
 * @returns {JSX.Element} The ProfileCard component.
 * 
 */

function ProfileCard({ profile, onEdit, onUpgrade }) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-md w-[800px] max-w-full mx-auto bg-white">
      <div className="overflow-hidden relative w-full h-[200px]">
        <img
          src={profile.banner?.url || "https://placehold.co/800x200/e8f0ff/e8f0ff"}
          alt={profile.banner?.alt || "Banner"}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex relative gap-5 px-10 py-5 max-md:px-5 max-md:py-4 max-sm:flex-col max-sm:text-center">
        <div className="mt-[-50px] max-sm:mx-auto">
          <img
            src={profile.avatar?.url || "https://placehold.co/100x100/f4f4f4/f4f4f4"}
            alt={profile.avatar?.alt || "Profile"}
            className="object-cover rounded-full border-4 border-white h-[100px] w-[100px]"
          />
        </div>
        <div className="flex-1">
          <div className="flex gap-2.5 items-baseline mb-2.5 max-sm:flex-col max-sm:gap-1.5 max-sm:items-center">
            <h2 className="text-2xl font-medium text-black">{profile.name}</h2>
            {profile.venueManager && (
              <p className="text-base text-stone-500">Venue Manager</p>
            )}
          </div>
          <p className="mb-2.5 text-base text-black">
            {profile.bio || "No bio provided."}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <ButtonMini
            text="Edit"
            onClick={onEdit}
            className="text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white h-12 px-4"
          />
          {!profile.venueManager && (
            <ButtonMini
              text="Upgrade to Manager"
              onClick={onUpgrade}
              className="text-harbour border-harbour bg-white hover:bg-harbour hover:text-white h-12 px-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
