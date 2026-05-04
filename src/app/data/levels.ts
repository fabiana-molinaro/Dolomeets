export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

export const levels: Level[] = [
  { level: 1, title: "Newcomer", minXP: 0, maxXP: 99, color: "#9E9E9E", icon: "🌱" },
  { level: 2, title: "Explorer", minXP: 100, maxXP: 249, color: "#8BC34A", icon: "🗺️" },
  { level: 3, title: "Participant", minXP: 250, maxXP: 499, color: "#4CAF50", icon: "🎯" },
  { level: 4, title: "Regular", minXP: 500, maxXP: 999, color: "#00BCD4", icon: "⭐" },
  { level: 5, title: "Enthusiast", minXP: 1000, maxXP: 1999, color: "#2196F3", icon: "🔥" },
  { level: 6, title: "Connector", minXP: 2000, maxXP: 3499, color: "#3F51B5", icon: "🤝" },
  { level: 7, title: "Leader", minXP: 3500, maxXP: 5499, color: "#9C27B0", icon: "👑" },
  { level: 8, title: "Champion", minXP: 5500, maxXP: 7999, color: "#E91E63", icon: "🏆" },
  { level: 9, title: "Legend", minXP: 8000, maxXP: 11999, color: "#FF5722", icon: "💎" },
  { level: 10, title: "Icon", minXP: 12000, maxXP: Infinity, color: "#FFD700", icon: "🌟" },
];

export function calculateXP(
  eventsAttended: number,
  eventsOrganized: number,
  badgesEarned: number
): number {
  // XP calculation formula
  const attendXP = eventsAttended * 50; // 50 XP per event attended
  const organizeXP = eventsOrganized * 150; // 150 XP per event organized
  const badgeXP = badgesEarned * 100; // 100 XP per badge earned

  return attendXP + organizeXP + badgeXP;
}

export function getCurrentLevel(xp: number): Level {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) {
      return levels[i];
    }
  }
  return levels[0];
}

export function getNextLevel(currentLevel: Level): Level | null {
  const currentIndex = levels.findIndex(l => l.level === currentLevel.level);
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return null;
}

export function getXPProgress(xp: number, currentLevel: Level): number {
  if (currentLevel.maxXP === Infinity) {
    return 100;
  }
  const levelXP = xp - currentLevel.minXP;
  const levelRange = currentLevel.maxXP - currentLevel.minXP + 1;
  return Math.min((levelXP / levelRange) * 100, 100);
}
