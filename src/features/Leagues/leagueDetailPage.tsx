'use client';

import { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LeagueTeamTable from './components/LeagueTeamTable';
import { useLeague } from './hooks/useLeague';
import { useDeleteLeague } from './hooks/useDeleteLeague';
import UpsertLeagueModal from './components/UpsertLeagueModal';
import { parseTeamsFromDescription } from './utils/leagueForm';
import type { LeagueTeam } from './types/leagues.types';

function buildDisplayTeams(
  teams: LeagueTeam[] | undefined,
  teamCount: number | undefined,
  startingBudget: number,
): LeagueTeam[] {
  if (!teamCount || teamCount < 1) return teams ?? [];

  return Array.from({ length: teamCount }, (_, index) => {
    const existingTeam = teams?.[index];
    return (
      existingTeam ?? [`team-${index + 1}`, `Team ${index + 1}`, startingBudget]
    );
  });
}

export default function LeagueDetailPage({ leagueId }: { leagueId: string }) {
  const { data, isLoading, error } = useLeague(leagueId);
  const router = useRouter();
  const editModal = useDisclosure();
  const deleteConfirm = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const deleteLeagueMutation = useDeleteLeague();

  if (isLoading) return <Spinner />;
  if (error) return <Text>Unable to load league</Text>;

  const league = data?.data;
  if (!league) return <Text>League not found</Text>;
  const teamCount =
    league.teams?.length ?? parseTeamsFromDescription(league.description);
  const leagueIdToDelete = league._id;
  const displayTeams = buildDisplayTeams(
    league.teams,
    teamCount,
    league.totalBudget ?? 0,
  );

  async function handleDelete() {
    try {
      await deleteLeagueMutation.mutateAsync(leagueIdToDelete);
      deleteConfirm.onClose();
      router.push('/leagues');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Box p={8}>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} align="center">
          <Button as={Link} href="/leagues" variant="ghost">
            Back
          </Button>
          <Button onClick={editModal.onOpen} variant="outline">
            Edit
          </Button>
          <Button
            onClick={deleteConfirm.onOpen}
            colorScheme="red"
            variant="outline"
          >
            Delete
          </Button>
        </Stack>

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
                <Td>{teamCount ?? '-'}</Td>
              </Tr>
              <Tr>
                <Td>Draft Type</Td>
                <Td>{league.draftType ?? '-'}</Td>
              </Tr>
              <Tr>
                <Td>Starting Budget</Td>
                <Td>
                  {typeof league.totalBudget === 'number'
                    ? `$${league.totalBudget}`
                    : '-'}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>

        {displayTeams.length ? (
          <Box>
            <Heading size="md" mb={2}>
              Teams
            </Heading>
            <SimpleGrid
              columns={{ base: 1, xl: 3 }}
              spacing={4}
              alignItems="start"
            >
              {displayTeams.map((team) => {
                const [teamId] = team;
                const takenPlayersForTeam =
                  league.taken_players?.filter(
                    ([, takenPlayerTeamId]) => takenPlayerTeamId === teamId,
                  ) ?? [];

                return (
                  <LeagueTeamTable
                    key={teamId}
                    team={team}
                    rosterSlots={league.rosterSlots}
                    takenPlayers={takenPlayersForTeam}
                    startingBudget={league.totalBudget ?? 0}
                  />
                );
              })}
            </SimpleGrid>
          </Box>
        ) : null}
      </Stack>

      <UpsertLeagueModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        initialLeague={league}
      />

      <AlertDialog
        isOpen={deleteConfirm.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteConfirm.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete League
            </AlertDialogHeader>

            <AlertDialogBody>
              This will permanently delete “{league.name}”. This action cannot
              be undone.
              {deleteLeagueMutation.isError ? (
                <Text mt={2} color="red.500">
                  Failed to delete league. Check API connection and API key.
                </Text>
              ) : null}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteConfirm.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={deleteLeagueMutation.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
