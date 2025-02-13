import React, { useState, useEffect } from "react";
import { venuesUrl, headers } from "../service/api";
import VenueCard from "../components/VenueCard";

function HomePage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(venuesUrl, { headers });
    
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }
    
        const data = await response.json();
        console.log("API Response:", data); // 🔍 Log the response
    
        setVenues(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    

    fetchVenues();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading venues...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mt-8">Welcome</h1>
      <p className="text-center mt-4">
        The best place to find your next event venue
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {venues.data.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
