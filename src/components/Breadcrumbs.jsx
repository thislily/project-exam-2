// Breadcrumbs.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = ({ overrideLast }) => {
  const location = useLocation();
  const { pathname } = location;
  const pathnames = pathname.split("/").filter((x) => x);

  // Define the segments that should not appear in the breadcrumbs.
  const unsupportedSegments = ["venue", "profile"];

  // Create an array of allowed segments along with their original index.
  const allowedSegments = pathnames
    .map((seg, idx) => ({ seg, idx }))
    .filter(({ seg }) => !unsupportedSegments.includes(seg.toLowerCase()));

  return (
    <nav aria-label="breadcrumb" className="text-sm my-4 font-medium font-body">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-harbour hover:underline">
            Home
          </Link>
        </li>
        {allowedSegments.map(({ seg, idx }, index) => {
          // Use the original index (idx) to generate the full route.
          const routeTo = `/${pathnames.slice(0, idx + 1).join("/")}`;
          let displayName =
            seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
          const isLast = index === allowedSegments.length - 1;
          if (isLast && overrideLast) {
            displayName = overrideLast;
          }
          return (
            <li key={idx} className="flex items-center">
              <span className="mx-2 text-gray-500">/</span>
              {isLast ? (
                <span className="text-gray-500">{displayName}</span>
              ) : (
                <Link to={routeTo} className="text-harbour hover:underline">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
