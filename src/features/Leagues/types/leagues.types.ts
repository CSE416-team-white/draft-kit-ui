export type League = {
  _id: string;
  name: string;
  teams: number;
};

export interface LeaguesResponse {
  success: boolean;
  data: League[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
