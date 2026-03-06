import { useQuery } from '@tanstack/react-query';
import { fetchLeagues } from '../utils/fetchLeagues';
import { LeaguesResponse } from '../types/leagues.types';
export function useLeagues() {
  return useQuery<LeaguesResponse>({
    queryKey: ['leagues'],
    queryFn: fetchLeagues,
  });
}
