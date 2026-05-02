import React from 'react';
import { Box, Chip, Stack } from '@mui/material';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Placement', value: 'Placement' },
  { label: 'Result', value: 'Result' },
  { label: 'Event', value: 'Event' },
];

export default function FilterBar({ filterType, onFilterChange }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
        {FILTERS.map((filter) => {
          const isActive = filter.value === filterType;
          return (
            <Chip
              key={filter.label}
              label={filter.label}
              onClick={() => onFilterChange(filter.value)}
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
