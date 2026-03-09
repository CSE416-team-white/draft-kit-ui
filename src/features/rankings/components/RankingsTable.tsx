'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Text,
  Tr,
} from '@chakra-ui/react';
import { api } from '@/lib/axios';

type Player = {
  _id: string;
  name: string;
  team: string;
  positions: string[];
  playerType: string;
  league: string;
  injuryStatus: string;
  active: boolean;
  age?: number;
  batSide?: string;
  pitchHand?: string;
};

type PlayersResponse = {
  data?: Player[];
};

export default function RankingsTable() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPlayers() {
      try {
        const response = (await api.get(
          '/players?limit=20',
        )) as PlayersResponse;
        const nextPlayers = response.data;

        if (!active) {
          return;
        }

        if (!nextPlayers || nextPlayers.length === 0) {
          setError('failed to retrieve data');
          return;
        }

        setPlayers(nextPlayers);
      } catch {
        if (active) {
          setError('failed to retrieve data');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadPlayers();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Box py={10} textAlign="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Team</Th>
            <Th>Pos</Th>
            <Th>Type</Th>
            <Th>League</Th>
            <Th>Status</Th>
            <Th>Age</Th>
            <Th>Bats/Throws</Th>
          </Tr>
        </Thead>
        <Tbody>
          {players.map((player, index) => (
            <Tr key={player._id}>
              <Td>{index + 1}</Td>
              <Td>{player.name}</Td>
              <Td>{player.team}</Td>
              <Td>{player.positions.join(', ')}</Td>
              <Td textTransform="capitalize">{player.playerType}</Td>
              <Td>{player.league}</Td>
              <Td>
                <Badge
                  colorScheme={
                    player.injuryStatus === 'active' ? 'green' : 'red'
                  }
                >
                  {player.injuryStatus}
                </Badge>
              </Td>
              <Td>{player.age ?? '-'}</Td>
              <Td>{player.batSide || player.pitchHand || '-'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
