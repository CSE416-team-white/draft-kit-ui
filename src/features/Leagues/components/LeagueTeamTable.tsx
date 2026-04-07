'use client';

import {
  Box,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import type {
  LeagueTeam,
  RosterSlots,
  TakenPlayer,
} from '../types/leagues.types';
import { DEFAULT_ROSTER_SLOTS, ROSTER_POSITIONS } from '../utils/leagueForm';

type LeagueTeamTableProps = {
  team: LeagueTeam;
  rosterSlots?: RosterSlots;
  takenPlayers?: TakenPlayer[];
  startingBudget: number;
};

type TeamTableRow = {
  rowId: string;
  position: string;
  playerName: string;
  price: number;
};

function buildTeamRows(
  rosterSlots: RosterSlots,
  takenPlayers: TakenPlayer[],
): TeamTableRow[] {
  let playerIndex = 0;

  return ROSTER_POSITIONS.flatMap((position) =>
    Array.from({ length: rosterSlots[position] }, (_, slotIndex) => {
      const player = takenPlayers[playerIndex];
      playerIndex += 1;

      return {
        rowId: `${position}-${slotIndex}`,
        position,
        playerName: player?.[0] ?? '',
        price: player?.[2] ?? 0,
      };
    }),
  );
}

function calculateCurrentBudget(
  startingBudget: number,
  takenPlayers: TakenPlayer[],
): number {
  const spent = takenPlayers.reduce((sum, [, , price]) => sum + price, 0);
  return Math.max(0, startingBudget - spent);
}

export default function LeagueTeamTable({
  team,
  rosterSlots = DEFAULT_ROSTER_SLOTS,
  takenPlayers = [],
  startingBudget,
}: LeagueTeamTableProps) {
  const [, teamName] = team;
  const rows = buildTeamRows(rosterSlots, takenPlayers);
  const currentBudget = calculateCurrentBudget(startingBudget, takenPlayers);

  return (
    <Box
      w="100%"
      minW="0"
      maxW="100%"
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      bg="white"
    >
      <Flex
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
        gap={2}
        px={4}
        py={3}
        bg="gray.50"
        borderBottomWidth="1px"
      >
        <Heading size="md">{teamName}</Heading>
        <Text fontWeight="semibold" color="gray.700">
          Budget: ${currentBudget}
        </Text>
      </Flex>

      <TableContainer w="auto">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Position</Th>
              <Th>Player</Th>
              <Th isNumeric>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row) => (
              <Tr key={row.rowId}>
                <Td>{row.position}</Td>
                <Td>{row.playerName || '-'}</Td>
                <Td isNumeric>{row.price}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
