'use client';

import { Button } from '@chakra-ui/react';
import Link from 'next/link';

type CardButtonProps = {
  label: string;
  href: string;
};

export default function CardButton({ label, href }: CardButtonProps) {
  return (
    <Button
      as={Link}
      href={href}
      bg="green.600"
      color="white"
      _hover={{ bg: 'green.700' }}
    >
      {label}
    </Button>
  );
}
