import { useQuery } from '@tanstack/react-query';
import { fetchLeagueById } from '../utils/fetchLeagueById';
import type { LeagueResponse } from '../types/leagues.types';

export function useLeague(leagueId?: string) {
  return useQuery<LeagueResponse>({
    queryKey: ['league', leagueId],
    queryFn: () => fetchLeagueById(leagueId as string),
    enabled: Boolean(leagueId),
  });
}
