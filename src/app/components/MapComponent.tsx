import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import L from "leaflet";
import { Event } from "../data/events";
import "../utils/leaflet-setup";

export function MapComponent({ events }: { events: Event[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map once on mount
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [46.4983, 11.3548],
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    
    // Small delay to ensure map renders properly
    setTimeout(() => {
      map.invalidateSize();
      setIsLoading(false);
    }, 100);

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when events change
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create custom icon
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background: #FF8C00; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    // Add markers for events
    events.forEach((event) => {
      const marker = L.marker([event.latitude, event.longitude], {
        icon: customIcon,
      });

      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-size: 14px; margin-bottom: 8px; font-weight: 600;">${event.title}</h3>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #666; margin-bottom: 4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${event.date} at ${event.time}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #666; margin-bottom: 12px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>${event.attendees}/${event.maxAttendees} attending</span>
          </div>
          <button 
            id="view-details-${event.id}"
            style="font-size: 12px; padding: 6px 12px; border-radius: 8px; background-color: #FF8C00; color: white; border: none; width: 100%; cursor: pointer; font-weight: 500;"
            onmouseover="this.style.backgroundColor='#E67E00'"
            onmouseout="this.style.backgroundColor='#FF8C00'"
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click handler for the button
      marker.on("popupopen", () => {
        const button = document.getElementById(`view-details-${event.id}`);
        if (button) {
          button.addEventListener("click", () => {
            navigate(`/app/events/${event.id}`);
          });
        }
      });

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (events.length > 0) {
      const bounds = L.latLngBounds(
        events.map((event) => [event.latitude, event.longitude] as [number, number])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [events, isLoading, navigate]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-600">Loading map...</div>
        </div>
      )}
    </div>
  );
}