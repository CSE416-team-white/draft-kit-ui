import { apiClient } from '@/shared/utils/api-client';
import type {
  CreateLeagueInput,
  CreateLeagueResponse,
  League,
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

export async function upsertLeague(
  input: CreateLeagueInput,
  existingLeague?: League,
): Promise<CreateLeagueResponse> {
  if (existingLeague && !existingLeague.externalId) {
    throw new Error(
      'Unable to update league: missing externalId. Refresh and try again.',
    );
  }

  const externalId = existingLeague?.externalId ?? toExternalId(input.name);

  return apiClient.post<CreateLeagueResponse>('/api/leagues', {
    externalId,
    name: input.name,
    description: `${input.teams} teams`,
    format: existingLeague?.format ?? 'roto',
    draftType: input.draftType,
    battingCategories: existingLeague?.battingCategories ?? [
      ...DEFAULT_BATTING_CATEGORIES,
    ],
    pitchingCategories: existingLeague?.pitchingCategories ?? [
      ...DEFAULT_PITCHING_CATEGORIES,
    ],
    rosterSlots: input.rosterSlots,
    totalBudget: existingLeague?.totalBudget ?? 260,
    isDefault: existingLeague?.isDefault ?? false,
    categoryWeights: existingLeague?.categoryWeights,
  });
}
