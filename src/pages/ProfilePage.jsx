import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import VenueCard from "../components/VenueCard";
import BookingCard from "../components/BookingCard";
import { profilesUrl, headers } from "../service/api";
import Loader from "../components/Loader";
import Breadcrumbs from "../components/Breadcrumbs";

function ProfilePage() {
  const { name } = useParams(); // e.g., /profile/:name
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // activeTab can be "venues", "upcoming", or "previous"
  const [activeTab, setActiveTab] = useState("venues");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch(
          `${profilesUrl}/${name}?_venues=true&_bookings=true`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        if (!data.data) throw new Error("No profile data returned");
        console.log("Fetched Profile Data:", data.data);
        setProfile(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (name) {
      fetchProfile();
    }
  }, [name]);

  if (loading) return <Loader />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!profile)
    return <div className="p-4 text-red-500">No profile data found.</div>;

  // Split bookings into upcoming and previous.
  const currentDate = new Date();
  const upcomingBookings = profile.bookings.filter(
    (booking) => new Date(booking.dateFrom) >= currentDate
  );
  const previousBookings = profile.bookings.filter(
    (booking) => new Date(booking.dateFrom) < currentDate
  );

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs />
      <ProfileCard profile={profile} />
      <div className="mt-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b  mb-4 w-[800px] max-w-full mx-auto">
          <button
            onClick={() => setActiveTab("venues")}
            className={`py-2 px-4 ${
              activeTab === "venues"
                ? "border-b-2 border-sunbeam font-bold"
                : "text-gray-800"
            }`}
          >
            Listed Venues
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-2 px-4 ${
              activeTab === "upcoming"
                ? "border-b-2 border-sunbeam font-bold"
                : "text-gray-800"
            }`}
          >
            Upcoming Bookings
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`py-2 px-4 ${
              activeTab === "previous"
                ? "border-b-2 border-sunbeam font-bold"
                : "text-gray-800"
            }`}
          >
            Previous Bookings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "venues" ? (
          profile.venues && profile.venues.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 p-0 pt-6 md:p-6 w-[800px] max-w-full mx-auto">
              {profile.venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <p className="w-[800px] max-w-full mx-auto">No listed venues found.</p>
          )
        ) : activeTab === "upcoming" ? (
          upcomingBookings && upcomingBookings.length > 0 ? (
            <div className="flex flex-wrap justify-start gap-6 p-0 pt-6 md:p-6 w-[800px] max-w-full mx-auto">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="w-[800px] max-w-full mx-auto">
              No upcoming bookings found.
            </p>
          )
        ) : activeTab === "previous" ? (
          previousBookings && previousBookings.length > 0 ? (
            <div className="flex flex-wrap justify-start gap-6 p-0 pt-6 md:p-6 w-[800px] max-w-full mx-auto">
              {previousBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="w-[800px] max-w-full mx-auto">
              No previous bookings found.
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}

export default ProfilePage;
