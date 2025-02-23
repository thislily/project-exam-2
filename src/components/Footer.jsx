import React from "react";

/**
 *
 * @name Footer
 * @description The footer component.
 * @returns {JSX.Element} The Footer component.
 *
 */

const Footer = () => {
  return (
    <footer className="flex flex-col text-xs font-semibold leading-5 text-white">
      <div className="p-4 w-full bg-slate-700 max-md:pr-5 max-md:max-w-full">
        ©2025 <br />
        Holidaze <br />
        All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
