import React from 'react';
import {
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from '@mui/material';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface FilterButtonsProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  filter,
  onFilterChange,
}) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: 'all' | 'active' | 'completed' | null
  ) => {
    if (newFilter !== null) {
      onFilterChange(newFilter);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleChange}
          aria-label="todo filter"
          color="primary"
        >
          <ToggleButton value="all" aria-label="all tasks">
            <AllInclusiveIcon sx={{ mr: 1 }} />
            All
          </ToggleButton>
          <ToggleButton value="active" aria-label="active tasks">
            <RadioButtonUncheckedIcon sx={{ mr: 1 }} />
            Active
          </ToggleButton>
          <ToggleButton value="completed" aria-label="completed tasks">
            <CheckCircleIcon sx={{ mr: 1 }} />
            Completed
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
};
