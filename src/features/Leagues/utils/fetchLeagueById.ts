import { apiClient } from '@/shared/utils/api-client';
import type { LeagueResponse } from '../types/leagues.types';

export async function fetchLeagueById(id: string): Promise<LeagueResponse> {
  return apiClient.get<LeagueResponse>(`/api/leagues/${id}`);
}
