'use client';

import UpsertLeagueModal from './UpsertLeagueModal';

type CreateLeagueModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateLeagueModal({
  isOpen,
  onClose,
}: CreateLeagueModalProps) {
  return <UpsertLeagueModal isOpen={isOpen} onClose={onClose} />;
}
