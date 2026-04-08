'use client';

export type Player = {
  _id: string;
  name: string;
  team: string;
  positions: string[];
  playerType?: string;
  league?: string;
  injuryStatus: string;
  active?: boolean;
  age?: number;
  batSide?: string;
  pitchHand?: string;
};

export type PlayersResponse = {
  data?: Player[];
  pagination?: {
    totalPages?: number;
  };
};

export type Notebook = {
  id: number;
  name: string;
  content: string;
};

export type NotebookListEntry = Pick<Notebook, 'id' | 'name'>;

export type NotebookWindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
