import { Link, useLocation } from "react-router";
import { Map, Calendar, User } from "lucide-react";

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: "/app", icon: Map, label: "Map" },
    { path: "/app/events", icon: Calendar, label: "Events" },
    { path: "/app/profile", icon: User, label: "Profile" },
  ];
  
  return (
    <nav className="border-t border-gray-200 bg-white">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative transition-all"
            >
              <div
                className="transition-all duration-200"
                style={{
                  transform: isActive ? "scale(1.1) translateY(-2px)" : "scale(1)",
                }}
              >
                <Icon
                  className="w-6 h-6 transition-all duration-200"
                  style={{ 
                    color: isActive ? "#FF8C00" : "#717182",
                    strokeWidth: isActive ? 2.5 : 2
                  }}
                />
              </div>
              <span
                className="text-xs transition-colors duration-200"
                style={{ color: isActive ? "#FF8C00" : "#717182" }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-1/2 h-0.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: "40px",
                    backgroundColor: "#FF8C00",
                    transform: "translateX(-50%)"
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}