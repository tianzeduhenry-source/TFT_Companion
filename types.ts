
export interface TFTSite {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
  category: 'Stats' | 'Guides' | 'Database' | 'Social';
}

export interface PatchAnalysis {
  version: string;
  summary: string;
  buffs: string[];
  nerfs: string[];
  topComps: string[];
  officialUrl?: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  AI_ASSISTANT = 'ai',
  RANK_CHECK = 'rank',
  CHEATSHEET = 'cheat',
  SETTINGS = 'settings'
}

export interface PlayerRankInfo {
  playerName: string;
  region: string;
  rank: string;
  lp: string;
  winRate: string;
  top4Rate: string;
  recentGames: string[];
  sourceUrl: string;
}

export interface PatchVersion {
  version: string;
  date: string;
  title: string;
}
