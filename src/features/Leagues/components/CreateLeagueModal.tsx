'use client';

import { useMemo, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { CreateLeagueInput, RosterSlots } from '../types/leagues.types';
import { useCreateLeague } from '../hooks/useCreateLeague';

type CreateLeagueModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DEFAULT_ROSTER_SLOTS: RosterSlots = {
  C: 1,
  '1B': 1,
  '2B': 1,
  '3B': 1,
  SS: 1,
  OF: 3,
  DH: 0,
  SP: 5,
  RP: 2,
  UTIL: 0,
  BENCH: 0,
};

const ROSTER_POSITIONS: (keyof RosterSlots)[] = [
  'C',
  '1B',
  '2B',
  '3B',
  'SS',
  'OF',
  'DH',
  'SP',
  'RP',
  'UTIL',
  'BENCH',
];

export default function CreateLeagueModal({
  isOpen,
  onClose,
}: CreateLeagueModalProps) {
  const createLeagueMutation = useCreateLeague();
  const [leagueName, setLeagueName] = useState('');
  const [teams, setTeams] = useState(12);
  const [draftType, setDraftType] = useState<'auction'>('auction');
  const [rosterSlots, setRosterSlots] =
    useState<RosterSlots>(DEFAULT_ROSTER_SLOTS);

  const canSubmit = useMemo(() => {
    return leagueName.trim().length > 0 && teams > 1;
  }, [leagueName, teams]);

  function handleRosterSlotChange(position: keyof RosterSlots, value: string) {
    const parsed = Number.parseInt(value, 10);
    setRosterSlots((prev) => ({
      ...prev,
      [position]: Number.isNaN(parsed) || parsed < 0 ? 0 : parsed,
    }));
  }

  function resetForm() {
    setLeagueName('');
    setTeams(12);
    setDraftType('auction');
    setRosterSlots(DEFAULT_ROSTER_SLOTS);
  }

  function handleClose() {
    createLeagueMutation.reset();
    resetForm();
    onClose();
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    const payload: CreateLeagueInput = {
      name: leagueName.trim(),
      teams,
      draftType,
      rosterSlots,
    };

    await createLeagueMutation.mutateAsync(payload);
    resetForm();
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create League</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>League Name</FormLabel>
              <Input
                placeholder="Enter league name"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel># of Teams</FormLabel>
              <Input
                type="number"
                min={2}
                value={teams}
                onChange={(e) =>
                  setTeams(
                    Math.max(2, Number.parseInt(e.target.value || '2', 10)),
                  )
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Draft Type</FormLabel>
              <Select
                value={draftType}
                onChange={(e) => setDraftType(e.target.value as 'auction')}
              >
                <option value="auction">Auction</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Roster Slots Per Position</FormLabel>
              <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={3}>
                {ROSTER_POSITIONS.map((position) => (
                  <GridItem key={position}>
                    <FormControl>
                      <FormLabel fontSize="sm" mb={1}>
                        {position}
                      </FormLabel>
                      <Input
                        type="number"
                        min={0}
                        value={rosterSlots[position]}
                        onChange={(e) =>
                          handleRosterSlotChange(position, e.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                ))}
              </Grid>
            </FormControl>

            {createLeagueMutation.isError ? (
              <Text color="red.500" fontSize="sm">
                Failed to create league. Check API connection and API key.
              </Text>
            ) : null}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!canSubmit}
            isLoading={createLeagueMutation.isPending}
          >
            Create League
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
