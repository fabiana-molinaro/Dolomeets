import { Link } from "react-router";
import { Home, MapPin } from "lucide-react";

export function NotFound() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div
          className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ backgroundColor: "#003366" }}
        >
          <MapPin className="w-12 h-12 text-white" />
        </div>
        <h1 className="mb-3" style={{ color: "#003366" }}>
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-all"
          style={{ backgroundColor: "#FF8C00" }}
        >
          <Home className="w-5 h-5" />
          Back to Map
        </Link>
      </div>
    </div>
  );
}
