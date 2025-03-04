import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AuthModal from "./AuthModal";

/**
 *
 * @name Layout
 * @description The layout component.
 * @returns {JSX.Element} The Layout component.
 *
 */

function Layout() {
  return (
    <div className=" font-body bg-gray-100 text-black">
      <Header />

      <main className="flex-grow min-h-screen mx-auto max-w-7xl bg-gray-100 pb-16 mt-16">
        {/* This is where page content will be rendered */}
        <Outlet />
        <AuthModal />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
