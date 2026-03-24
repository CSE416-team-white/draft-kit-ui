'use client';

import { Spinner, Text, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useLeagues } from '../hooks/useLeagues';
import LeagueCard from './LeagueCard';
import CreateLeagueModal from './CreateLeagueModal';

export default function LeagueList() {
  const router = useRouter();
  const { data, isLoading, error } = useLeagues();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading) return <Spinner />;

  if (error) return <Text>Error loading leagues</Text>;

  return (
    <>
      <SimpleGrid columns={{ base: 3 }}>
        <LeagueCard label="+ New League" onClick={onOpen} />
        {data?.data.map((league) => (
          <LeagueCard
            key={league._id}
            league={league}
            onClick={() => router.push(`/leagues/${league._id}`)}
          />
        ))}
      </SimpleGrid>
      <CreateLeagueModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
