import { createBrowserRouter } from "react-router";
import { MapView } from "./pages/MapView";
import { EventsView } from "./pages/EventsView";
import { EventDetail } from "./pages/EventDetail";
import { ProfileView } from "./pages/ProfileView";
import { LoginView } from "./pages/LoginView";
import { Root } from "./pages/Root";
import { NotFound } from "./pages/NotFound";
import { OnboardingFlow } from "./components/OnboardingFlow";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginView,
  },
  {
    path: "/onboarding",
    Component: OnboardingFlow,
  },
  {
    path: "/app",
    Component: Root,
    children: [
      { index: true, Component: MapView },
      { path: "events", Component: EventsView },
      { path: "events/:id", Component: EventDetail },
      { path: "profile", Component: ProfileView },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);