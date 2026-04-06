import { Box, Flex } from '@chakra-ui/react';
import NotebookListPanel from './components/NotebookListPanel';
import NotebookWorkspace from './components/NotebookWorkspace';

export default function NotebookPage() {
  return (
    <Box p={8}>
      <Flex gap={8} align="stretch" minH="calc(100vh - 140px)">
        <NotebookWorkspace />
        <NotebookListPanel />
      </Flex>
    </Box>
  );
}
