import { Box, Heading } from '@chakra-ui/react';
import RankingsTable from './components/RankingsTable';
import RankingsApiText from './components/RankingsApiText';

export default function RankingsPage() {
  return (
    <Box p={8}>
      <Heading mb={6}>Rankings</Heading>
      <RankingsTable />
      <RankingsApiText />
    </Box>
  );
}
