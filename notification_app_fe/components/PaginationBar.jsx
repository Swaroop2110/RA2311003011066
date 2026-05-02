import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';

export default function PaginationBar({ page, hasMore, loading, onNext, onPrev }) {
  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="outlined"
          onClick={onPrev}
          disabled={page <= 1 || loading}
        >
          Previous
        </Button>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Page {page}
        </Typography>
        <Button
          variant="outlined"
          onClick={onNext}
          disabled={!hasMore || loading}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
}
