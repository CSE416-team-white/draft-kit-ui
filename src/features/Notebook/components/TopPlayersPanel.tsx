'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { apiClient } from '@/shared/utils/api-client';

type Player = {
  _id: string;
  name: string;
  team: string;
  positions: string[];
  playerType?: string;
  league?: string;
  injuryStatus: string;
  active?: boolean;
  age?: number;
  batSide?: string;
  pitchHand?: string;
};

type PlayersResponse = {
  data?: Player[];
  pagination?: {
    totalPages?: number;
  };
};

type TopPlayersPanelProps = {
  onOpenPlayer: (player: Player) => void;
};

export default function TopPlayersPanel({
  onOpenPlayer,
}: TopPlayersPanelProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [playersError, setPlayersError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPlayers() {
      try {
        setIsLoadingPlayers(true);
        setPlayersError(null);

        const firstPage = await apiClient.get<PlayersResponse>('/api/players', {
          params: { limit: 100, page: 1 },
        });
        const firstBatch = firstPage.data ?? [];
        const totalPages = firstPage.pagination?.totalPages ?? 1;
        const pageRequests: Promise<PlayersResponse>[] = [];

        for (let page = 2; page <= totalPages; page += 1) {
          pageRequests.push(
            apiClient.get<PlayersResponse>('/api/players', {
              params: { limit: 100, page },
            }),
          );
        }

        const remainingPages = await Promise.all(pageRequests);
        const allPlayers = [
          ...firstBatch,
          ...remainingPages.flatMap((page) => page.data ?? []),
        ];

        if (!active) {
          return;
        }

        setPlayers(allPlayers);
      } catch {
        if (active) {
          setPlayersError('Unable to load players');
        }
      } finally {
        if (active) {
          setIsLoadingPlayers(false);
        }
      }
    }

    loadPlayers();

    return () => {
      active = false;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const displayedPlayers = players
    .filter((player) =>
      normalizedSearch
        ? player.name.toLowerCase().includes(normalizedSearch)
        : true,
    )
    .slice(0, 4);

  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>
        Top Players
      </Heading>

      <Input
        mb={4}
        placeholder="Search top players"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        aria-label="Search top players"
      />

      {isLoadingPlayers ? (
        <Flex justify="center" py={4}>
          <Spinner size="sm" />
        </Flex>
      ) : null}

      {playersError ? (
        <Text color="red.500" fontSize="sm">
          {playersError}
        </Text>
      ) : null}

      {!isLoadingPlayers && !playersError ? (
        <VStack align="stretch" spacing={3}>
          {displayedPlayers.map((player, index) => (
            <Box
              key={player._id}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="white"
              px={4}
              py={3}
              boxShadow="sm"
              cursor="pointer"
              _hover={{ borderColor: 'green.400', boxShadow: 'md' }}
              transition="all 0.15s ease"
              onClick={() => onOpenPlayer(player)}
            >
              <Flex align="center" justify="space-between" gap={3}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  #{index + 1}
                </Text>
                <Badge
                  colorScheme={
                    player.injuryStatus === 'active' ? 'green' : 'red'
                  }
                  textTransform="capitalize"
                >
                  {player.injuryStatus}
                </Badge>
              </Flex>

              <Text mt={2} fontWeight="semibold" color="gray.800">
                {player.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {player.team}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {player.positions.join(', ') || 'No position'}
              </Text>
            </Box>
          ))}
          {displayedPlayers.length === 0 ? (
            <Text fontSize="sm" color="gray.500">
              No players found.
            </Text>
          ) : null}
        </VStack>
      ) : null}
    </Box>
  );
}
