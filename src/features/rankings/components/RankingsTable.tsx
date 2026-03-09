'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Text,
  Tr,
  Wrap,
  WrapItem,
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
  const [positions, setPositions] = useState<string[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPositions() {
      try {
        const response = (await api.get(
          '/players?limit=100',
        )) as PlayersResponse;
        const allPlayers = response.data;

        if (!active || !allPlayers || allPlayers.length === 0) {
          return;
        }

        const nextPositions = Array.from(
          new Set(allPlayers.flatMap((player) => player.positions)),
        ).sort();

        setPositions(nextPositions);
      } catch {}
    }

    loadPositions();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPlayers() {
      setIsLoading(true);
      setError(null);

      try {
        const query = selectedPosition
          ? `/players?limit=50&position=${selectedPosition}`
          : '/players?limit=50';
        const response = (await api.get(query)) as PlayersResponse;
        const nextPlayers = response.data;

        if (!active || !nextPlayers || nextPlayers.length === 0) {
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
  }, [selectedPosition]);

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
    <Box>
      <Wrap mb={4} spacing={2}>
        <WrapItem>
          <Button
            colorScheme={selectedPosition === null ? 'teal' : 'gray'}
            onClick={() => setSelectedPosition(null)}
            size="sm"
          >
            All
          </Button>
        </WrapItem>
        {positions.map((position) => (
          <WrapItem key={position}>
            <Button
              colorScheme={selectedPosition === position ? 'teal' : 'gray'}
              onClick={() => setSelectedPosition(position)}
              size="sm"
            >
              {position}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

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
    </Box>
  );
}
