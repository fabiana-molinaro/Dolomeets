import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router";
import { Event } from "../data/events";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const attendancePercentage = (event.attendees / event.maxAttendees) * 100;
  
  return (
    <Link
      to={`/app/events/${event.id}`}
      className="block"
    >
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all active:scale-98"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: "#FF8C00", color: "white" }}
                >
                  {event.category}
                </span>
                {event.isAttending && (
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: "#28A745", color: "white" }}
                  >
                    Attending
                  </span>
                )}
              </div>
              <h3 className="mt-2">{event.title}</h3>
            </div>
            <img
              src={event.organizerAvatar}
              alt={event.organizer}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
          
          {/* Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4" style={{ color: "#003366" }} />
              <span>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4" style={{ color: "#003366" }} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="w-4 h-4" style={{ color: "#003366" }} />
              <span>{event.attendees}/{event.maxAttendees} attending</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${attendancePercentage}%`,
                  backgroundColor: attendancePercentage > 80 ? "#FF8C00" : "#28A745",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}