'use client';

import { Box, Text } from '@chakra-ui/react';
import { League } from '../types/leagues.types';

interface LeagueCardProps {
  league?: League;
  label?: string;
  onClick?: () => void;
}

export default function LeagueCard({
  league,
  label,
  onClick,
}: LeagueCardProps) {
  return (
    <Box
      as="button"
      w="240px"
      h="240px"
      margin={10}
      borderRadius="md"
      border="2px solid"
      borderColor="gray.200"
      bg="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      _hover={{ bg: 'gray.50', borderColor: 'gray.400' }}
      _active={{ bg: 'gray.100' }}
      transition="all 0.15s ease"
      cursor="pointer"
      onClick={onClick}
    >
      <Text fontSize="lg" fontWeight="semibold" color="gray.700">
        {label ?? league?.name}
      </Text>
    </Box>
  );
}
