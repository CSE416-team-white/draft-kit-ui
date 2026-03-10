import { apiClient } from '@/shared/utils/api-client';
import type {
  CreateLeagueInput,
  CreateLeagueResponse,
} from '../types/leagues.types';

const DEFAULT_BATTING_CATEGORIES = ['R', 'HR', 'RBI', 'SB', 'AVG'] as const;
const DEFAULT_PITCHING_CATEGORIES = ['W', 'SV', 'K', 'ERA', 'WHIP'] as const;

function toExternalId(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `custom-${slug || 'league'}-${Date.now()}`;
}

export async function createLeague(
  input: CreateLeagueInput,
): Promise<CreateLeagueResponse> {
  return apiClient.post<CreateLeagueResponse>('/api/leagues', {
    externalId: toExternalId(input.name),
    name: input.name,
    description: `${input.teams} teams`,
    format: 'roto',
    draftType: input.draftType,
    battingCategories: [...DEFAULT_BATTING_CATEGORIES],
    pitchingCategories: [...DEFAULT_PITCHING_CATEGORIES],
    rosterSlots: input.rosterSlots,
    totalBudget: 260,
    isDefault: false,
  });
}
