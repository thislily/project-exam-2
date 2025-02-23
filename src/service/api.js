/**
 * @name api.js
 * @description The API configuration file.
 * @returns {string} The API URL.
 *
 */

export const apiUrl = process.env.REACT_APP_API_URL;
export const loginUrl = apiUrl + "/auth/login";
export const registerUrl = apiUrl + "/auth/register";
export const bookingsUrl = apiUrl + "/holidaze/bookings";
export const venuesUrl = apiUrl + "/holidaze/venues";
export const profilesUrl = apiUrl + "/holidaze/profiles";

const apiKey = process.env.REACT_APP_API_KEY;

export const accessToken = localStorage.getItem("accessToken");

export const headers = {
  Authorization: `Bearer ${accessToken}`,
  "X-Noroff-API-Key": apiKey,
  "Content-Type": "application/json",
};
