export interface ReferralLevel {
  levelNumber: number;
  memberCount: number;
  totalBTEarned: number;
  hasMembers: boolean;
  label: string;
}

export interface ReferralSummary {
  totalMembers: number;
  totalBTEarned: number;
  filledLevels: number;
  emptyLevels: number;
}

export interface ReferralLevelSummary {
  custId: number;
  totalLevels: number;
  levels: ReferralLevel[];
  summary: ReferralSummary;
}
