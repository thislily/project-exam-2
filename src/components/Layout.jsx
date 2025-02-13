/**
 * @file Layout component
 * @name Layout
 * @returns {JSX.Element} Layout component
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div className=" font-body bg-gray-100 text-black">
      <Header />

      <main className="flex-grow p-4 min-h-screen mx-auto max-w-7xl bg-gray-100 pb-16 mt-16">
        {/* This is where page content will be rendered */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;