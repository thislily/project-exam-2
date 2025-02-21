import { Link } from "react-router-dom";
import ButtonMini from "./ButtonMini";
import Logo from "../assets/LogoWhite.svg";
import { useAuth } from "../context/AuthContext"; // Import the global auth hook

function Header() {
  const { openAuthModal } = useAuth(); // Get function from context

  return (
    <div className="bg-harbour text-white fixed top-0 w-full z-10">
      <header className="bg-harbour text-white p-2 max-w-7xl flex items-end justify-between mx-auto">
        {/* Logo linking to home */}
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-90" />
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4">
          <Link to="/create-venue" className="text-base font-medium hover:underline">
            List your Property
          </Link>
          <ButtonMini text="Log in" onClick={openAuthModal} />
        </nav>
      </header>
    </div>
  );
}

export default Header;
