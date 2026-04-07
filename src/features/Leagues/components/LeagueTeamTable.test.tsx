import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import LeagueTeamTable from './LeagueTeamTable';

describe('LeagueTeamTable', () => {
  it('renders the team name, calculated budget, and rows from roster slots', () => {
    render(
      <ChakraProvider>
        <LeagueTeamTable
          team={['team-1', 'Alpha', 999]}
          startingBudget={260}
          rosterSlots={{
            C: 1,
            '1B': 1,
            '2B': 0,
            '3B': 0,
            SS: 0,
            OF: 2,
            DH: 0,
            SP: 0,
            RP: 0,
            UTIL: 0,
            BENCH: 0,
          }}
          takenPlayers={[
            ['Adley Rutschman', 'team-1', 20],
            ['Freddie Freeman', 'team-1', 35],
            ['Julio Rodriguez', 'team-1', 40],
          ]}
        />
      </ChakraProvider>,
    );

    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.getByText('Budget: $165')).toBeTruthy();
    expect(screen.getByText('C')).toBeTruthy();
    expect(screen.getByText('1B')).toBeTruthy();
    expect(screen.getAllByText('OF')).toHaveLength(2);
    expect(screen.getByText('Adley Rutschman')).toBeTruthy();
    expect(screen.getByText('Freddie Freeman')).toBeTruthy();
    expect(screen.getByText('Julio Rodriguez')).toBeTruthy();
  });

  it('shows empty rows when there are fewer players than roster slots', () => {
    render(
      <ChakraProvider>
        <LeagueTeamTable
          team={['team-2', 'Beta', 0]}
          startingBudget={300}
          rosterSlots={{
            C: 1,
            '1B': 0,
            '2B': 0,
            '3B': 0,
            SS: 0,
            OF: 0,
            DH: 0,
            SP: 1,
            RP: 0,
            UTIL: 0,
            BENCH: 1,
          }}
          takenPlayers={[['William Contreras', 'team-2', 15]]}
        />
      </ChakraProvider>,
    );

    expect(screen.getByText('Budget: $285')).toBeTruthy();
    expect(screen.getByText('William Contreras')).toBeTruthy();
    expect(screen.getAllByText('-')).toHaveLength(2);
  });
});
