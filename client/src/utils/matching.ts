import { IUser } from '../types';
import { calculateHaversineDistance } from './distance';

export interface IMatchBreakdown {
  score: number;
  reasons: string[];
}

export function calculateSmartMatch(
  currentUser: Partial<IUser>,
  targetUser: Partial<IUser>,
  sportName: string = 'Badminton'
): IMatchBreakdown {
  let score = 0;
  const reasons: string[] = [];

  // 1. Same City (+20)
  if (currentUser.city && targetUser.city && currentUser.city.toLowerCase() === targetUser.city.toLowerCase()) {
    score += 20;
    reasons.push(`Both in ${currentUser.city}`);
  }

  // 2. Nearby Location (+25 if <= 5km, +15 if <= 10km)
  const dist = calculateHaversineDistance(
    currentUser.latitude || 17.4401,
    currentUser.longitude || 78.3489,
    targetUser.latitude || 17.4401,
    targetUser.longitude || 78.3489
  );

  if (dist <= 3) {
    score += 25;
    reasons.push(`Super close (${dist} km away)`);
  } else if (dist <= 8) {
    score += 18;
    reasons.push(`Nearby (${dist} km away)`);
  } else if (dist <= 15) {
    score += 10;
    reasons.push(`Within ${dist} km`);
  }

  // 3. Sport & Skill Level Compatibility
  const sport1 = currentUser.sports?.find(s => s.sport.toLowerCase() === sportName.toLowerCase());
  const sport2 = targetUser.sports?.find(s => s.sport.toLowerCase() === sportName.toLowerCase());

  if (sport1 && sport2) {
    score += 10;
    reasons.push(`Both play ${sportName}`);

    if (sport1.skillLevel === sport2.skillLevel) {
      score += 20;
      reasons.push(`Same skill level (${sport1.skillLevel})`);
    } else {
      score += 10;
      reasons.push(`Compatible skill levels (${sport1.skillLevel} & ${sport2.skillLevel})`);
    }

    if (sport1.playingStyle === sport2.playingStyle || sport1.playingStyle === 'Both' || sport2.playingStyle === 'Both') {
      score += 10;
      reasons.push(`Matching style (${sport1.playingStyle})`);
    }

    if (sport1.preferredTime === sport2.preferredTime) {
      score += 8;
      reasons.push(`Prefer ${sport1.preferredTime.toLowerCase()} sessions`);
    }

    const commonDays = sport1.availableDays?.filter(d => sport2.availableDays?.includes(d)) || [];
    if (commonDays.length > 0) {
      score += 7;
      reasons.push(`Available on ${commonDays.slice(0, 2).join(', ')}`);
    }
  } else {
    // Shared interests check
    const commonInterests = currentUser.interests?.filter(i => targetUser.interests?.includes(i)) || [];
    if (commonInterests.length > 0) {
      score += 15;
      reasons.push(`Shared interests: ${commonInterests.slice(0, 2).join(', ')}`);
    }
  }

  return {
    score: Math.min(100, Math.max(10, score)),
    reasons
  };
}

export function calculateRoommateCompatibility(user1: Partial<IUser>, user2: Partial<IUser>): IMatchBreakdown {
  let score = 50;
  const reasons: string[] = [];

  if (user1.city === user2.city) {
    score += 15;
    reasons.push('Same city preference');
  }

  if (user1.area === user2.area) {
    score += 20;
    reasons.push(`Both interested in ${user1.area}`);
  }

  if (user1.gender === user2.gender || user2.gender === 'Any') {
    score += 10;
    reasons.push('Gender preference matches');
  }

  const common = user1.interests?.filter(i => user2.interests?.includes(i)) || [];
  if (common.length > 0) {
    score += 15;
    reasons.push(`Similar lifestyle & interests: ${common.join(', ')}`);
  }

  return {
    score: Math.min(99, Math.max(60, score)),
    reasons
  };
}
