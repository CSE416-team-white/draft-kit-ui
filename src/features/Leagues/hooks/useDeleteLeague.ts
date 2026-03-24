import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLeague } from '../utils/deleteLeague';

export function useDeleteLeague() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leagueId: string) => deleteLeague(leagueId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leagues'] });
      void queryClient.invalidateQueries({ queryKey: ['league'] });
    },
  });
}
