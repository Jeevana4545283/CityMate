import { IUser } from '../models/User';
import { calculateHaversineDistance } from './locationService';

export interface IMatchResult {
  score: number; // 0 - 100%
  reasons: string[];
}

export function calculatePlayerMatch(user1: Partial<IUser>, user2: Partial<IUser>, sportName = 'Badminton'): IMatchResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Same City (+20)
  if (user1.city && user2.city && user1.city.toLowerCase() === user2.city.toLowerCase()) {
    score += 20;
    reasons.push(`Both in ${user1.city}`);
  }

  // 2. Nearby Location (+25 if <= 5km, +15 if <= 10km)
  if (user1.latitude && user1.longitude && user2.latitude && user2.longitude) {
    const dist = calculateHaversineDistance(user1.latitude, user1.longitude, user2.latitude, user2.longitude);
    if (dist <= 5) {
      score += 25;
      reasons.push(`Nearby (${dist} km away)`);
    } else if (dist <= 10) {
      score += 15;
      reasons.push(`Within ${dist} km`);
    }
  }

  // 3. Sport & Skill Level Match
  const sport1 = user1.sports?.find(s => s.sport.toLowerCase() === sportName.toLowerCase());
  const sport2 = user2.sports?.find(s => s.sport.toLowerCase() === sportName.toLowerCase());

  if (sport1 && sport2) {
    score += 10;
    reasons.push(`Both play ${sportName}`);

    if (sport1.skillLevel === sport2.skillLevel) {
      score += 20;
      reasons.push(`Same skill level (${sport1.skillLevel})`);
    } else {
      score += 10;
      reasons.push(`Compatible skill level (${sport1.skillLevel} & ${sport2.skillLevel})`);
    }

    if (sport1.playingStyle === sport2.playingStyle || sport1.playingStyle === 'Both' || sport2.playingStyle === 'Both') {
      score += 5;
      reasons.push(`Matching playing style (${sport1.playingStyle})`);
    }

    if (sport1.preferredTime === sport2.preferredTime) {
      score += 5;
      reasons.push(`Prefer ${sport1.preferredTime.toLowerCase()} games`);
    }

    const commonDays = sport1.availableDays?.filter(d => sport2.availableDays?.includes(d)) || [];
    if (commonDays.length > 0) {
      score += 5;
      reasons.push(`Available on ${commonDays.slice(0, 2).join(', ')}`);
    }
  } else {
    // Check common interests
    const commonInterests = user1.interests?.filter(i => user2.interests?.includes(i)) || [];
    if (commonInterests.length > 0) {
      score += 15;
      reasons.push(`Shared interests: ${commonInterests.slice(0, 2).join(', ')}`);
    }
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    reasons
  };
}
