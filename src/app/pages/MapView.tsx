import { useState, useEffect } from "react";
import { Search, Filter, Sparkles } from "lucide-react";
import { MapComponent } from "../components/MapComponent";
import { mockEvents, Event } from "../data/events";
import { PageTransition } from "../components/PageTransition";

export function MapView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommended, setShowRecommended] = useState(false);
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);

  useEffect(() => {
    // Load favorite categories from localStorage
    const savedCategories = localStorage.getItem("favoriteCategories");
    if (savedCategories) {
      setFavoriteCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    let events = mockEvents;

    if (showRecommended && favoriteCategories.length > 0) {
      events = events.filter((event) =>
        favoriteCategories.includes(event.category)
      );
    }

    if (searchQuery) {
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(events);
  }, [searchQuery, showRecommended, favoriteCategories]);

  return (
    <PageTransition>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 flex items-center gap-3 bg-white shadow-sm z-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
            />
          </div>
          {favoriteCategories.length > 0 && (
            <button
              onClick={() => setShowRecommended(!showRecommended)}
              className="p-2.5 rounded-lg border border-gray-200 transition-all active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: showRecommended ? "#FF8C00" : "white",
                borderColor: showRecommended ? "#FF8C00" : "#E5E7EB",
              }}
            >
              <Sparkles
                className="w-5 h-5"
                style={{ color: showRecommended ? "white" : "#FF8C00" }}
              />
            </button>
          )}
          <button className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all active:scale-95">
            <Filter className="w-5 h-5" style={{ color: "#003366" }} />
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapComponent events={filteredEvents} />
        </div>
      </div>
    </PageTransition>
  );
}