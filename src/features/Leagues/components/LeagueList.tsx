'use client';

import { Spinner, Text, SimpleGrid } from '@chakra-ui/react';
import { useLeagues } from '../hooks/useLeagues';
import LeagueCard from './LeagueCard';

export default function LeagueList() {
  const { data, isLoading, error } = useLeagues();

  if (isLoading) return <Spinner />;

  if (error) return <Text>Error loading leagues</Text>;

  return (
    <SimpleGrid columns={{ base: 3 }}>
      <LeagueCard
        label="+ New League"
        onClick={() => console.log('Create new league')}
      />
      {data?.data.map((league) => (
        <LeagueCard key={league._id} league={league} />
      ))}
    </SimpleGrid>
  );
}
