import { useState } from "react";
import { useNavigate } from "react-router";
import { Settings, ChevronRight, Calendar, MapPin, Users, Heart, Bell, X, LogOut, User, Mail, Lock, HelpCircle, Info, RefreshCw, Award, Zap } from "lucide-react";
import { mockEvents } from "../data/events";
import { PageTransition } from "../components/PageTransition";
import { badges, calculateEarnedBadges, Badge } from "../data/badges";
import { calculateXP, getCurrentLevel, getNextLevel, getXPProgress } from "../data/levels";

type ModalView = "myEvents" | "favorites" | "notifications" | "settings" | "badges" | null;

export function ProfileView() {
  const [activeModal, setActiveModal] = useState<ModalView>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const navigate = useNavigate();

  const userProfile = {
    name: "Emma Schmidt",
    email: "emma.schmidt@student.unibz.it",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    major: "Computer Science",
    year: "3rd Year",
    eventsAttended: mockEvents.filter(e => e.isAttending).length,
    eventsOrganized: 3,
  };

  const attendingEvents = mockEvents.filter(e => e.isAttending);

  const favoriteEvents = mockEvents.slice(0, 5);

  const earnedBadgeIds = calculateEarnedBadges(
    userProfile.eventsAttended,
    userProfile.eventsOrganized
  );
  const earnedBadges = badges.filter(b => earnedBadgeIds.includes(b.id));
  const lockedBadges = badges.filter(b => !earnedBadgeIds.includes(b.id));

  // Level calculations
  const totalXP = calculateXP(
    userProfile.eventsAttended,
    userProfile.eventsOrganized,
    earnedBadges.length
  );
  const currentLevel = getCurrentLevel(totalXP);
  const nextLevel = getNextLevel(currentLevel);
  const xpProgress = getXPProgress(totalXP, currentLevel);

  const notifications = [
    { id: 1, title: "Tech Talk Tomorrow", message: "Don't forget about the AI workshop at 3PM", time: "2 hours ago", read: false },
    { id: 2, title: "New Event Added", message: "Mountain Hiking this Sunday", time: "5 hours ago", read: false },
    { id: 3, title: "Event Cancelled", message: "Language Exchange has been postponed", time: "1 day ago", read: true },
  ];

  const menuItems = [
    { icon: Calendar, label: "My Events", count: attendingEvents.length, action: () => setActiveModal("myEvents") },
    { icon: Award, label: "Badges & Achievements", count: earnedBadges.length, action: () => setActiveModal("badges") },
    { icon: Heart, label: "Favorites", count: favoriteEvents.length, action: () => setActiveModal("favorites") },
    { icon: Bell, label: "Notifications", count: notifications.filter(n => !n.read).length, action: () => setActiveModal("notifications") },
    { icon: Settings, label: "Settings", count: null, action: () => setActiveModal("settings") },
  ];
  
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  const handleResetPreferences = () => {
    if (confirm("Are you sure you want to reset your preferences? You'll be taken through the onboarding process again.")) {
      localStorage.removeItem("onboardingComplete");
      localStorage.removeItem("favoriteCategories");
      navigate("/onboarding");
    }
  };

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  const handleEventClick = (eventId: string) => {
    setActiveModal(null);
    navigate(`/app/events/${eventId}`);
  };

  return (
    <PageTransition>
      <div className="h-full flex flex-col bg-gray-50 overflow-auto">
        {/* Header */}
        <div className="px-4 py-6" style={{ backgroundColor: "#003366" }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white">Profile</h1>
            <button
              onClick={() => setActiveModal("settings")}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="flex items-center gap-4">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1 text-white">
              <h2>{userProfile.name}</h2>
              <p className="text-sm opacity-90">{userProfile.major}</p>
              <p className="text-xs opacity-75">{userProfile.year}</p>
            </div>
          </div>
        </div>
        
        {/* Level Card */}
        <button
          onClick={() => setActiveModal("badges")}
          className="w-full px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
              style={{ backgroundColor: currentLevel.color + "20" }}
            >
              {currentLevel.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 style={{ color: currentLevel.color }}>Level {currentLevel.level}</h3>
                <span className="text-sm text-gray-600">• {currentLevel.title}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" style={{ color: "#FFD700" }} />
                <span className="text-sm text-gray-700">{totalXP} XP</span>
              </div>
              {nextLevel && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor: currentLevel.color,
                        width: `${xpProgress}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {nextLevel.minXP - totalXP} XP to {nextLevel.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Stats */}
        <div className="px-4 py-4 bg-white border-b border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl mb-1" style={{ color: "#FF8C00" }}>{userProfile.eventsAttended}</p>
              <p className="text-xs text-gray-600">Attending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-1" style={{ color: "#003366" }}>{userProfile.eventsOrganized}</p>
              <p className="text-xs text-gray-600">Organized</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-1" style={{ color: currentLevel.color }}>{earnedBadges.length}</p>
              <p className="text-xs text-gray-600">Badges</p>
            </div>
          </div>
        </div>

        {/* Badges Preview */}
        {earnedBadges.length > 0 && (
          <div className="mt-4 px-4">
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ color: "#003366" }}>Recent Badges</h3>
              <button
                onClick={() => setActiveModal("badges")}
                className="text-sm"
                style={{ color: "#FF8C00" }}
              >
                View All
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {earnedBadges.slice(0, 5).map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => handleBadgeClick(badge)}
                  className="flex-shrink-0 w-20 text-center hover:opacity-80 transition-opacity"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 shadow-md"
                    style={{ backgroundColor: badge.color + "20" }}
                  >
                    {badge.icon}
                  </div>
                  <p className="text-xs truncate">{badge.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="mt-4 bg-white">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  index < menuItems.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" style={{ color: "#003366" }} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.count !== null && item.count > 0 && (
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#FF8C00", color: "white" }}
                    >
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <div className="mt-4 px-4 pb-4">
          <h3 className="mb-3" style={{ color: "#003366" }}>Upcoming Events</h3>
          <div className="space-y-3">
            {attendingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#FF8C00" }}
                  >
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 truncate">{event.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modals */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setActiveModal(null)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
              {/* Modal Header */}
              <div
                className="px-4 py-4 flex items-center justify-between border-b border-gray-200"
                style={{ backgroundColor: "#003366" }}
              >
                <h2 className="text-white">
                  {activeModal === "myEvents" && "My Events"}
                  {activeModal === "badges" && "Badges & Achievements"}
                  {activeModal === "favorites" && "Favorite Events"}
                  {activeModal === "notifications" && "Notifications"}
                  {activeModal === "settings" && "Settings"}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto p-4">
                {activeModal === "badges" && (
                  <div className="space-y-6">
                    {/* Level Summary */}
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: currentLevel.color + "15" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md"
                          style={{ backgroundColor: currentLevel.color + "30" }}
                        >
                          {currentLevel.icon}
                        </div>
                        <div>
                          <h3 style={{ color: currentLevel.color }}>
                            Level {currentLevel.level} - {currentLevel.title}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <Zap className="w-4 h-4" style={{ color: "#FFD700" }} />
                            {totalXP} XP Total
                          </div>
                        </div>
                      </div>
                      {nextLevel && (
                        <div>
                          <div className="flex items-center justify-between mb-1 text-sm">
                            <span className="text-gray-600">Progress to Level {nextLevel.level}</span>
                            <span style={{ color: currentLevel.color }}>{Math.round(xpProgress)}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                backgroundColor: currentLevel.color,
                                width: `${xpProgress}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {nextLevel.minXP - totalXP} XP needed to reach {nextLevel.title}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Badge Progress Summary */}
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#FFF5E6" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Badges Collected</span>
                        <span className="text-sm" style={{ color: "#FF8C00" }}>
                          {earnedBadges.length} / {badges.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            backgroundColor: "#FF8C00",
                            width: `${(earnedBadges.length / badges.length) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>💡 Earn XP by:</p>
                        <p>• Attending events: +50 XP each</p>
                        <p>• Organizing events: +150 XP each</p>
                        <p>• Unlocking badges: +100 XP each</p>
                      </div>
                    </div>

                    {/* Earned Badges */}
                    {earnedBadges.length > 0 && (
                      <div>
                        <h3 className="text-sm mb-3" style={{ color: "#003366" }}>
                          UNLOCKED ({earnedBadges.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {earnedBadges.map((badge) => (
                            <button
                              key={badge.id}
                              onClick={() => handleBadgeClick(badge)}
                              className="bg-white rounded-lg p-4 border-2 shadow-sm hover:shadow-lg transition-shadow text-left"
                              style={{ borderColor: badge.color }}
                            >
                              <div
                                className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mx-auto mb-2 shadow-md"
                                style={{ backgroundColor: badge.color + "20" }}
                              >
                                {badge.icon}
                              </div>
                              <h4 className="text-sm text-center mb-1" style={{ color: badge.color }}>
                                {badge.name}
                              </h4>
                              <p className="text-xs text-gray-600 text-center">
                                {badge.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Locked Badges */}
                    {lockedBadges.length > 0 && (
                      <div>
                        <h3 className="text-sm mb-3 text-gray-500">
                          LOCKED ({lockedBadges.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {lockedBadges.map((badge) => (
                            <button
                              key={badge.id}
                              onClick={() => handleBadgeClick(badge)}
                              className="bg-white rounded-lg p-4 border-2 border-gray-200 opacity-60 hover:opacity-80 transition-opacity text-left"
                            >
                              <div
                                className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mx-auto mb-2 bg-gray-100 grayscale"
                              >
                                {badge.icon}
                              </div>
                              <h4 className="text-sm text-center mb-1 text-gray-700">
                                {badge.name}
                              </h4>
                              <p className="text-xs text-gray-500 text-center">
                                {badge.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeModal === "myEvents" && (
                  <div className="space-y-3">
                    {attendingEvents.length > 0 ? (
                      attendingEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event.id)}
                          className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[#FF8C00] transition-colors text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#FF8C00" }}
                            >
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="mb-1 truncate">{event.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {event.date} at {event.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No events yet</p>
                        <p className="text-sm mt-1">Browse events to get started!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeModal === "favorites" && (
                  <div className="space-y-3">
                    {favoriteEvents.length > 0 ? (
                      favoriteEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event.id)}
                          className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[#FF8C00] transition-colors text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#003366" }}
                            >
                              <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="mb-1 truncate">{event.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <Users className="w-3 h-3" />
                                <span>{event.attendees} attending</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No favorites yet</p>
                        <p className="text-sm mt-1">Save events to see them here!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeModal === "notifications" && (
                  <div className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`bg-white rounded-lg p-4 shadow-sm border ${
                            notification.read ? "border-gray-100" : "border-[#FF8C00]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: notification.read ? "#f0f0f0" : "#FFF3E0",
                              }}
                            >
                              <Bell
                                className="w-5 h-5"
                                style={{
                                  color: notification.read ? "#999" : "#FF8C00",
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`mb-1 ${!notification.read ? "font-semibold" : ""}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No notifications</p>
                        <p className="text-sm mt-1">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeModal === "settings" && (
                  <div className="space-y-6">
                    {/* Account Section */}
                    <div>
                      <h3 className="text-sm mb-3 text-gray-500">ACCOUNT</h3>
                      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5" style={{ color: "#003366" }} />
                            <span>Edit Profile</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5" style={{ color: "#003366" }} />
                            <span>Change Email</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5" style={{ color: "#003366" }} />
                            <span>Change Password</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Preferences Section */}
                    <div>
                      <h3 className="text-sm mb-3 text-gray-500">PREFERENCES</h3>
                      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5" style={{ color: "#003366" }} />
                            <span>Notifications</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5" style={{ color: "#003366" }} />
                            <span>Location Services</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                          onClick={handleResetPreferences}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <RefreshCw className="w-5 h-5" style={{ color: "#FF8C00" }} />
                            <span>Reset Event Preferences</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Support Section */}
                    <div>
                      <h3 className="text-sm mb-3 text-gray-500">SUPPORT</h3>
                      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5" style={{ color: "#003366" }} />
                            <span>Help & Support</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <Info className="w-5 h-5" style={{ color: "#003366" }} />
                            <span>About</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedBadge(null)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl z-10 animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Badge Display */}
              <div className="p-6 text-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg"
                  style={{ backgroundColor: selectedBadge.color + "20" }}
                >
                  {selectedBadge.icon}
                </div>

                <h2 className="mb-2" style={{ color: selectedBadge.color }}>
                  {selectedBadge.name}
                </h2>

                <p className="text-gray-600 mb-4">{selectedBadge.description}</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <div
                    className="px-3 py-1 rounded-full text-xs text-white"
                    style={{ backgroundColor: selectedBadge.color }}
                  >
                    {selectedBadge.category.charAt(0).toUpperCase() + selectedBadge.category.slice(1)}
                  </div>
                  {earnedBadgeIds.includes(selectedBadge.id) && (
                    <div className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      ✓ Unlocked
                    </div>
                  )}
                </div>

                {!earnedBadgeIds.includes(selectedBadge.id) && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>How to unlock:</strong> {selectedBadge.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}