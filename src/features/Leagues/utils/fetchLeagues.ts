import { League } from '../types/leagues.types';
interface LeaguesResponse {
  success: boolean;
  data: League[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchLeagues(): Promise<LeaguesResponse> {
  const res = await fetch('http://localhost:3001/api/leagues');
  if (!res.ok) throw new Error('Failed to fetch leagues');

  return res.json();
}
