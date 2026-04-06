import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export default function NotebookListPanel() {
  return (
    <Box flex="1">
      <Heading mb={6}>Notebooks per game</Heading>

      <VStack align="stretch" spacing={5}>
        <Box
          w="100%"
          minH="88px"
          px={6}
          borderRadius="md"
          border="2px solid"
          borderColor="gray.200"
          bg="white"
          display="flex"
          alignItems="center"
          _hover={{ bg: 'gray.50', borderColor: 'gray.400' }}
          transition="all 0.15s ease"
        >
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            Notebook list goes here
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
