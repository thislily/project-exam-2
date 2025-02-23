import React, { useState } from "react";
import { Link } from "react-router-dom";
import ButtonMini from "./ButtonMini";
import Logo from "../assets/LogoWhite.svg";
import { useAuth } from "../context/AuthContext";

/**
 *
 * @name Header
 * @description The header component.
 * @returns {JSX.Element} The Header component.
 *
 */

function Header() {
  const { openAuthModal, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-harbour text-white fixed top-0 w-full z-10 mb-16">
      <header className="bg-harbour text-white font-body p-2 max-w-7xl flex items-end justify-between mx-auto">
        {/* Logo linking to home */}
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-[60px]" />
        </Link>

        {/* Navigation Links */}

        <nav className="flex items-center gap-4">
          {!user && (
            <Link
              to="/create-venue"
              className="text-base font-medium hover:underline"
            >
              List your Property
            </Link>
          )}
          {user && (
            <p className="text-base font-medium hidden sm:block">
              Hello, {user.name.split(" ")[0]}!
            </p>
          )}

          {user ? (
            // When logged in, show the avatar with dropdown menu
            <div className="relative">
              <img
                src={
                  user.avatar?.url ||
                  "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                }
                alt={user.avatar?.alt || "User Avatar"}
                className="w-12 h-12 mb-1 me-1 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black font-body font-medium rounded-md rounded-t-none shadow-lg">
                  <Link
                    to={`/profile/${user.name}`}
                    className="block px-4 py-2 hover:bg-breeze"
                  >
                    View Profile
                  </Link>

                  <Link
                    to="/create-venue"
                    className="block px-4 py-2 hover:bg-breeze"
                  >
                    List your Property
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 rounded-b-md hover:bg-breeze"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // When not logged in, show the Log in button
            <ButtonMini
              text="Log in"
              onClick={openAuthModal}
              className="border-breeze hover:bg-breeze text-black"
            />
          )}
        </nav>
      </header>
    </div>
  );
}

export default Header;
