'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { STORAGE_KEYS } from '@/shared/constants';
import { apiClient } from '@/shared/utils/api-client';
import { storage } from '@/shared/utils/storage';
import RankingsTable from './components/RankingsTable';

type SyncTriggerResponse = {
  data?: {
    syncRunId?: string;
  };
};

type SyncRun = {
  status?: string;
  error?: string;
};

type SyncRunResponse = {
  data?: SyncRun;
};

export default function RankingsPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  async function pollSyncRun(runId: string): Promise<SyncRun> {
    while (true) {
      const response = await apiClient.get<SyncRunResponse>(
        `/api/players/sync-runs/${runId}`,
      );
      const run = response.data;

      if (!run?.status) {
        throw new Error('Unable to track sync status');
      }

      setSyncStatusText(`Sync status: ${run.status}`);

      if (run.status === 'succeeded') {
        storage.remove(STORAGE_KEYS.PLAYERS_SYNC_RUN_ID);
        return run;
      }

      if (run.status === 'failed') {
        storage.remove(STORAGE_KEYS.PLAYERS_SYNC_RUN_ID);
        throw new Error(run.error || 'Sync failed');
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
  }

  async function handleSync() {
    setSyncing(true);
    setSyncStatusText('Sync status: starting');
    storage.remove(STORAGE_KEYS.PLAYERS_SYNC_RUN_ID);

    try {
      const trigger = await apiClient.post<SyncTriggerResponse>(
        '/api/players/sync/tracked',
      );
      const runId = trigger.data?.syncRunId;

      if (!runId) {
        throw new Error('Sync run id was not returned');
      }

      storage.set(STORAGE_KEYS.PLAYERS_SYNC_RUN_ID, runId);
      await pollSyncRun(runId);
      setRefreshKey((current) => current + 1);

      toast({
        title: 'Players synced',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      storage.remove(STORAGE_KEYS.PLAYERS_SYNC_RUN_ID);
      setSyncStatusText('Sync status: failed');
      toast({
        title: 'Sync failed',
        description: 'Could not sync players. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    let active = true;
    const existingRunId = storage.get<string>(STORAGE_KEYS.PLAYERS_SYNC_RUN_ID);

    if (!existingRunId) {
      return () => {
        active = false;
      };
    }
    const runId = existingRunId;

    async function resumeSync() {
      setSyncing(true);
      setSyncStatusText('Sync status: reconnecting');

      try {
        await pollSyncRun(runId);

        if (!active) {
          return;
        }

        setRefreshKey((current) => current + 1);
        toast({
          title: 'Players synced',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch {
        storage.remove(STORAGE_KEYS.PLAYERS_SYNC_RUN_ID);

        if (!active) {
          return;
        }

        setSyncStatusText('Sync status: failed');
        toast({
          title: 'Sync failed',
          description: 'Could not sync players. Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        if (active) {
          setSyncing(false);
        }
      }
    }

    void resumeSync();

    return () => {
      active = false;
    };
  }, [toast]);

  return (
    <Box p={8}>
      <Flex align="center" justify="space-between" mb={6}>
        <Heading>Rankings</Heading>
        <Button
          colorScheme="teal"
          isDisabled={syncing}
          isLoading={syncing}
          loadingText="Syncing..."
          onClick={handleSync}
          size="sm"
        >
          Sync
        </Button>
      </Flex>
      {syncStatusText ? (
        <Text color="gray.600" fontSize="sm" mb={4}>
          {syncStatusText}
        </Text>
      ) : null}
      <RankingsTable refreshKey={refreshKey} />
    </Box>
  );
}
