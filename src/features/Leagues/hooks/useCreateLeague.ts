import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateLeagueInput } from '../types/leagues.types';
import { createLeague } from '../utils/createLeague';

export function useCreateLeague() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLeagueInput) => createLeague(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leagues'] });
    },
  });
}
