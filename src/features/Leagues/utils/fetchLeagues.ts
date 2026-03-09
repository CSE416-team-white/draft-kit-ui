import { apiClient } from '@/shared/utils/api-client';
import { LeaguesResponse } from '../types/leagues.types';

export async function fetchLeagues(): Promise<LeaguesResponse> {
  return apiClient.get<LeaguesResponse>('/api/leagues');
}
