import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { EventCard } from "../components/EventCard";
import { mockEvents } from "../data/events";
import { PageTransition } from "../components/PageTransition";

export function EventsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "attending" | "upcoming" | "recommended">("recommended");
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load favorite categories from localStorage
    const savedCategories = localStorage.getItem("favoriteCategories");
    if (savedCategories) {
      setFavoriteCategories(JSON.parse(savedCategories));
    }
  }, []);

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "attending") {
      return matchesSearch && event.isAttending;
    }

    if (filterType === "upcoming") {
      const eventDate = new Date(event.date);
      const today = new Date();
      return matchesSearch && eventDate >= today;
    }

    if (filterType === "recommended" && favoriteCategories.length > 0) {
      return matchesSearch && favoriteCategories.includes(event.category);
    }

    return matchesSearch;
  });

  return (
    <PageTransition>
      <div className="h-full flex flex-col bg-gray-50">
        {/* Header */}
        <div className="px-4 py-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h1 style={{ color: "#003366" }}>Events</h1>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <SlidersHorizontal className="w-5 h-5" style={{ color: "#003366" }} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto md:flex-wrap pb-1">
            {favoriteCategories.length > 0 && (
              <button
                onClick={() => setFilterType("recommended")}
                className="px-4 py-2 rounded-lg text-sm transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                style={{
                  backgroundColor: filterType === "recommended" ? "#FF8C00" : "transparent",
                  color: filterType === "recommended" ? "white" : "#FF8C00",
                  border: filterType === "recommended" ? "none" : "1px solid #FF8C00",
                }}
              >
                <Sparkles className="w-4 h-4" />
                For You
              </button>
            )}
            {(["all", "attending", "upcoming"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="px-4 py-2 rounded-lg text-sm transition-all active:scale-95 flex-shrink-0"
                style={{
                  backgroundColor: filterType === type ? "#003366" : "transparent",
                  color: filterType === type ? "white" : "#003366",
                  border: filterType === type ? "none" : "1px solid #003366",
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-auto px-4 py-4 scroll-smooth">
          <div className="space-y-3 pb-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No events found</p>
                {filterType === "recommended" && (
                  <button
                    onClick={() => setFilterType("all")}
                    className="mt-3 text-sm"
                    style={{ color: "#FF8C00" }}
                  >
                    View all events
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}