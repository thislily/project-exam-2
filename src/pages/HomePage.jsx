import React, { useState, useEffect, useRef } from "react";
import { venuesUrl, headers } from "../service/api";
import VenueCard from "../components/VenueCard";
import { Loader } from "lucide-react";

function HomePage() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("created-desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  // Fetch venues from API
  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);
        const [sortField, sortOrder] = sortOption.split("-");
        const response = await fetch(
          `${venuesUrl}?sort=${sortField}&sortOrder=${sortOrder}&limit=50&page=${page}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (data.data.length === 0) {
          setHasMore(false);
        }

        // If we're on the first page or changed sort, reset the arrays
        if (page === 1) {
          setVenues(data.data);
          setFilteredVenues(data.data);
        } else {
          setVenues((prev) => [...prev, ...data.data]);
          setFilteredVenues((prev) => [...prev, ...data.data]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [page, sortOption]);

  // Search functionality with delay
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredVenues(venues);
      } else {
        setFilteredVenues(
          venues.filter(
            (venue) =>
              venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              venue.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, venues]);

  // Infinite scrolling effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [target] = entries;
        if (target.isIntersecting) {
          console.log("Loading more venues...");
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,         // Observe scrolling in the viewport
        rootMargin: "200px",// Start loading just before it's actually in view
        threshold: 0,       // Trigger when the loader is near the viewport
      }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        //eslint-disable-next-line
        observer.unobserve(loader.current);
      }
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loader.current]); // <--- ESLint complains, but we disable it above

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  if (loading && page === 1) {
    return <p className="text-center mt-4">Loading venues...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      {/* Splash Image */}
      <div
        className="relative h-[400px] bg-cover bg-center w-full"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-20 flex flex-col justify-center items-center p-6">
          <h1 className="text-black text-4xl font-heading mb-4 text-center">
            Adventure starts with just a click
          </h1>
          <input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sunbeam text-lg"
          />
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-start mt-4 px-6">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="p-3 border border-gray-500 rounded-md text-lg font-semibold"
        >
          <option value="created-desc">Newest</option>
          <option value="created-asc">Oldest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Venue Cards Grid */}
      <div className="flex flex-wrap justify-center gap-6 p-0 pt-6 md:p-6">
        {filteredVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={loader} className="text-center p-4 mx-auto">
        {hasMore && <Loader />}
      </div>
    </div>
  );
}

export default HomePage;
