"use client"
import React, { useEffect, useState } from 'react';

interface LocationData {
  ip: string;
  city: string;
  country: string;
  region: string;
  latitude?: number;
  longitude?: number;
}

const getLocationByIP = async (): Promise<LocationData | null> => {
  const services = [
    {
      url: 'https://ipapi.co/json/',
      transform: (data: any): LocationData => ({
        ip: data.ip,
        city: data.city || 'Unknown',
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        latitude: data.latitude,
        longitude: data.longitude,
      }),
    },
    {
      url: 'https://ip-api.com/json/',
      transform: (data: any): LocationData => ({
        ip: data.query,
        city: data.city || 'Unknown',
        country: data.country || 'Unknown',
        region: data.regionName || 'Unknown',
        latitude: data.lat,
        longitude: data.lon,
      }),
    },
  ];

  for (const service of services) {
    try {
      const response = await fetch(service.url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Service ${service.url} returned non-ok status`);
        continue;
      }

      const data = await response.json();
      return service.transform(data);
    } catch (error) {
      console.warn(`Error fetching from ${service.url}:`, error);
      continue;
    }
  }

  return null;
};

const LocationPage: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const result = await getLocationByIP();
      if (result) {
        setLocation(result);
      } else {
        setError('Could not retrieve location information.');
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Location</h1>
      {location ? (
        <div className="bg-white text-black shadow-md rounded-lg p-6">
          <p>
            <strong>IP Address:</strong> {location.ip || 'Unknown'}
          </p>
          <p>
            <strong>City:</strong> {location.city}
          </p>
          <p>
            <strong>Country:</strong> {location.country}
          </p>
          <p>
            <strong>Region:</strong> {location.region}
          </p>
          {location.latitude && location.longitude && (
            <p>
              <strong>Coordinates:</strong> {location.latitude}, {location.longitude}
            </p>
          )}
        </div>
      ) : error ? (
        <div className="text-red-500 bg-red-100 p-4 rounded">
          <p>{error}</p>
          <p>Please check your network connection or try again later.</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default LocationPage;
