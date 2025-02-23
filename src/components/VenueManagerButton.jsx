import React from "react";
import { Link } from "react-router-dom";
import { User, ChevronRight } from "lucide-react";

function VenueManagerButton({ owner }) {
  if (!owner || !owner.name) {
    return null;
  }

  const { name, avatar } = owner;
  const hasAvatar = avatar && avatar.url;

  return (
    <Link
      to={`/profile/${encodeURIComponent(name)}`}
      className="flex flex-col text-base leading-loose text-black rounded-md max-w-[360px] no-underline"
      aria-label={`Go to ${name}'s profile`}
    >
      <div className="flex gap-4 justify-between align-middle px-4 py-2 w-full bg-white rounded-md shadow-md">
        <div className="flex gap-2">
          {hasAvatar ? (
            <img
              loading="lazy"
              src={avatar.url}
              alt={avatar.alt || "Venue Manager profile"}
              className="object-cover shrink-0 w-14 rounded-full h-14"
            />
          ) : (
            <User className="w-14 h-14" />
          )}
          <div className="flex flex-col justify-center ps-1">
            <div className="font-medium text-gray-500">Venue Manager</div>
            <div className="">{name}</div>
          </div>
        </div>
        <ChevronRight size={32} className="w-8 h-8 my-auto" />
      </div>
    </Link>
  );
}

export default VenueManagerButton;
