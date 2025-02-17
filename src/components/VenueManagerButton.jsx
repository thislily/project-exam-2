import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

/**
 * VenueManager
 * Use the owner's avatar if available, otherwise fallback to an icon.
 * If there's no valid owner or no ID, we render nothing.
 */
function VenueManager({ owner }) {
  // if no valid owner, return null
  if (!owner || !owner.id) {
    return null;
  }

  const hasAvatar = owner.avatar?.url;

  return (
    <Link
      to={`/profile/${owner.name}`}
      className="flex items-center w-auto gap-2 h-[46px] bg-white bg-opacity-50 border-[3px] border-black shadow-md px-3 py-1 text-black font-semibold cursor-pointer"
      aria-label="Go to manager's profile"
    >
      {hasAvatar ? (
        <img
          src={owner.avatar.url}
          alt={owner.avatar.alt || "Manager Avatar"}
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <User className="w-6 h-6" />
      )}

      {/* Use dynamic name if you'd like, else fallback to 'Manager' */}
      <span className="leading-none">
        {owner.name || "Manager"}
      </span>
    </Link>
  );
}

export default VenueManager;
