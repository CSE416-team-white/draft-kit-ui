import type { Player } from '../types/notebook.types';

export function filterTopPlayers(
  players: Player[],
  searchTerm: string,
): Player[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return players
    .filter((player) =>
      normalizedSearch
        ? player.name.toLowerCase().includes(normalizedSearch)
        : true,
    )
    .slice(0, 4);
}
