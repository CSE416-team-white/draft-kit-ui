'use client';

import {
  Box,
  Heading,
  Spinner,
  Stack,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  Thead,
  TableContainer,
  Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useLeague } from './hooks/useLeague';

export default function LeagueDetailPage({ leagueId }: { leagueId: string }) {
  const { data, isLoading, error } = useLeague(leagueId);

  if (isLoading) return <Spinner />;
  if (error) return <Text>Unable to load league</Text>;

  const league = data?.data;
  if (!league) return <Text>League not found</Text>;

  return (
    <Box p={8}>
      <Stack spacing={4}>
        <Button
          as={Link}
          href="/leagues"
          variant="ghost"
          alignSelf="flex-start"
        >
          Back
        </Button>

        <Heading>{league.name}</Heading>

        <TableContainer borderWidth="1px" borderRadius="md">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Field</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>ID</Td>
                <Td>{league._id}</Td>
              </Tr>
              <Tr>
                <Td>Teams</Td>
                <Td>{league.teams ?? '-'}</Td>
              </Tr>
              <Tr>
                <Td>Draft Type</Td>
                <Td>{league.draftType ?? '-'}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>

        {league.rosterSlots ? (
          <Box>
            <Heading size="md" mb={2}>
              Roster Slots
            </Heading>
            <TableContainer borderWidth="1px" borderRadius="md">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Position</Th>
                    <Th isNumeric>Slots</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(league.rosterSlots).map(
                    ([position, slots]) => (
                      <Tr key={position}>
                        <Td>{position}</Td>
                        <Td isNumeric>{slots}</Td>
                      </Tr>
                    ),
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}
