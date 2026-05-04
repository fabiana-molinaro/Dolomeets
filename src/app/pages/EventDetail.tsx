import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, MapPin, Users, Share2 } from "lucide-react";
import { mockEvents } from "../data/events";
import { PageTransition } from "../components/PageTransition";
import L from "leaflet";
import "../utils/leaflet-setup";

const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background: #FF8C00; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === id);
  const [isAttending, setIsAttending] = useState(event?.isAttending || false);
  const [currentAttendees, setCurrentAttendees] = useState(event?.attendees || 0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    if (!mapRef.current || !event) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [event.latitude, event.longitude],
        zoom: 15,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const customIcon = createCustomIcon();
      L.marker([event.latitude, event.longitude], { icon: customIcon }).addTo(map);

      mapInstanceRef.current = map;
      
      // Ensure map renders properly
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [event]);
  
  if (!event) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }
  
  const attendancePercentage = (currentAttendees / event.maxAttendees) * 100;
  
  const handleAttendance = () => {
    if (isAttending) {
      // Cancel attendance - decrease count
      setCurrentAttendees(prev => Math.max(0, prev - 1));
    } else {
      // Attend event - increase count
      setCurrentAttendees(prev => Math.min(event.maxAttendees, prev + 1));
    }
    setIsAttending(!isAttending);
  };
  
  return (
    <PageTransition>
      <div className="h-full flex flex-col bg-white overflow-auto">
        {/* Header */}
        <div 
          className="px-4 py-4 flex items-center justify-between" 
          style={{ backgroundColor: "#003366" }}
        >
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Event Details</h2>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Share2 className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Map Preview */}
          <div className="h-48 relative">
            <div ref={mapRef} className="w-full h-full" />
          </div>
          
          {/* Event Info */}
          <div className="p-4">
            {/* Category & Status */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: "#FF8C00", color: "white" }}
              >
                {event.category}
              </span>
              {isAttending && (
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#28A745", color: "white" }}
                >
                  You're Attending
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="mb-2" style={{ color: "#003366" }}>
              {event.title}
            </h1>
            
            {/* Organizer */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <img
                src={event.organizerAvatar}
                alt={event.organizer}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">Organized by</p>
                <p>{event.organizer}</p>
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-0.5" style={{ color: "#003366" }} />
                <div>
                  <p className="text-gray-500 text-sm">Date & Time</p>
                  <p>{event.date}</p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5" style={{ color: "#003366" }} />
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p>{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 mt-0.5" style={{ color: "#003366" }} />
                <div className="flex-1">
                  <p className="text-gray-500 text-sm mb-2">Attendees</p>
                  <p className="mb-2">{currentAttendees}/{event.maxAttendees} people attending</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${attendancePercentage}%`,
                        backgroundColor: attendancePercentage > 80 ? "#FF8C00" : "#28A745",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2" style={{ color: "#003366" }}>About</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleAttendance}
            className="w-full py-3 rounded-lg text-white transition-all"
            style={{
              backgroundColor: isAttending ? "#28A745" : "#FF8C00",
            }}
          >
            {isAttending ? "Cancel Attendance" : "Attend Event"}
          </button>
        </div>
      </div>
    </PageTransition>
  );
}