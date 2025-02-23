import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import VenueCard from "../components/VenueCard";
import BookingCard from "../components/BookingCard";
import { profilesUrl, headers } from "../service/api";
import Loader from "../components/Loader";
import Breadcrumbs from "../components/Breadcrumbs";

function ProfilePage() {
  const { name } = useParams(); // Assumes route: /profile/:name
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("venues");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the profile with enriched venues and bookings data.
        const profileRes = await fetch(
          `${profilesUrl}/${name}?_venues=true&_bookings=true`,
          { headers }
        );
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profileJson = await profileRes.json();
        setProfile(profileJson.data);
        console.log("Fetched Profile Data:", profileJson.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    // Fetch data only ONCE if name is available.
    if (name) {
      fetchData();
    }
  }, [name]);


  if (loading) return <Loader />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs />
      {profile && <ProfileCard profile={profile} />}
      <div className="mt-8">
        {/* Tab navigation */}
        <div className="flex gap-4 border-b mb-4 w-[800px] max-w-full mx-auto">
          <button
            onClick={() => setActiveTab("venues")}
            className={`py-2 px-4 ${
              activeTab === "venues" ? "border-b-2 border-sunbeam font-bold" : "text-gray-800"
            }`}
          >
            Venues
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-2 px-4 ${
              activeTab === "bookings" ? "border-b-2 border-sunbeam font-bold" : "text-gray-800"
            }`}
          >
            Bookings
          </button>
        </div>
        {activeTab === "venues" ? (
          profile.venues && profile.venues.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 p-0 pt-6 md:p-6 w-[800px] max-w-full mx-auto">
              {profile.venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <p className="w-[800px] max-w-full mx-auto">No venues found.</p>
          )
        ) : (
          profile.bookings && profile.bookings.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 p-0 pt-6 md:p-6 w-[800px] max-w-full mx-auto">
              {profile.bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="w-[800px] max-w-full mx-auto">No bookings found.</p>
          )
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
