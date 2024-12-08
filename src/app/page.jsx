import React from 'react';



async function getLocationByIP(){
  try {
    // Option 1: Use ipapi.co (free service with good reliability)
    const response = await fetch('https://ipapi.co/json/', {
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: 'force-cache'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch IP location');
    }

    const data = await response.json();

    return {
      ip: data.ip,
      city: data.city,
      country: data.country_name,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

export default async function LocationPage() {
  const location = await getLocationByIP();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Location</h1>
      {location ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p><strong>IP Address:</strong> {location.ip}</p>
          <p><strong>City:</strong> {location.city}</p>
          <p><strong>Country:</strong> {location.country}</p>
          <p><strong>Region:</strong> {location.region}</p>
          <p><strong>Coordinates:</strong> {location.latitude}, {location.longitude}</p>
        </div>
      ) : (
        <p className="text-red-500">Could not retrieve location information</p>
      )}
    </div>
  );
}