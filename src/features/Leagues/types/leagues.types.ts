export type RosterSlots = {
  C: number;
  '1B': number;
  '2B': number;
  '3B': number;
  SS: number;
  OF: number;
  DH: number;
  SP: number;
  RP: number;
  UTIL: number;
  BENCH: number;
};

export type League = {
  _id: string;
  name: string;
  teams?: number;
  draftType?: 'auction' | 'snake';
  rosterSlots?: RosterSlots;
};

export type CreateLeagueInput = {
  name: string;
  teams: number;
  draftType: 'auction';
  rosterSlots: RosterSlots;
};

export interface CreateLeagueResponse {
  success: boolean;
  data: League;
}

export interface LeaguesResponse {
  success: boolean;
  data: League[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeagueResponse {
  success: boolean;
  data: League;
}
