import LeagueDetailPage from '@/features/Leagues/leagueDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return <LeagueDetailPage leagueId={leagueId} />;
}
