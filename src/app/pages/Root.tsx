import { Outlet, useLocation } from "react-router";
import { BottomNav } from "../components/BottomNav";

export function Root() {
  const location = useLocation();
  const isEventDetail = location.pathname.includes("/events/");
  
  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>
      {!isEventDetail && <BottomNav />}
    </div>
  );
}