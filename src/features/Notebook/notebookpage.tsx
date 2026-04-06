import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export default function NotebookPage() {
  return (
    <Box px={8} py={10}>
      <VStack align="start" spacing={4}>
        <Heading size="lg">Notebook</Heading>
        <Text color="gray.600">
          Keep scouting notes, draft targets, and reminders in one place.
        </Text>
      </VStack>
    </Box>
  );
}
