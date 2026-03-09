'use client';

import { useState } from 'react';
import { Box, Button, Flex, Heading, useToast } from '@chakra-ui/react';
import { apiClient } from '@/shared/utils/api-client';
import RankingsTable from './components/RankingsTable';

export default function RankingsPage() {
  const [syncing, setSyncing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  async function handleSync() {
    setSyncing(true);

    try {
      await apiClient.post<unknown>('/api/players/sync');
      setRefreshKey((current) => current + 1);
      toast({
        title: 'Players synced',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
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

  return (
    <Box p={8}>
      <Flex align="center" justify="space-between" mb={6}>
        <Heading>Rankings</Heading>
        <Button
          colorScheme="teal"
          isDisabled={syncing}
          isLoading={syncing}
          loadingText="Syncing"
          onClick={handleSync}
          size="sm"
        >
          Sync
        </Button>
      </Flex>
      <RankingsTable refreshKey={refreshKey} />
    </Box>
  );
}
