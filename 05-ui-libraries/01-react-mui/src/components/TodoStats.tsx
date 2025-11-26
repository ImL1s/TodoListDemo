import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Todo } from '../types';

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Statistics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              bgcolor: 'primary.light',
              borderRadius: 1,
              color: 'white',
            }}
          >
            <FormatListBulletedIcon />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {total}
              </Typography>
              <Typography variant="body2">Total Tasks</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              bgcolor: 'warning.light',
              borderRadius: 1,
              color: 'white',
            }}
          >
            <RadioButtonUncheckedIcon />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {active}
              </Typography>
              <Typography variant="body2">Active</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              bgcolor: 'success.light',
              borderRadius: 1,
              color: 'white',
            }}
          >
            <CheckCircleIcon />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {completed}
              </Typography>
              <Typography variant="body2">Completed</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Chip
          label={`${completionRate}% Complete`}
          color={completionRate === 100 ? 'success' : 'primary'}
          size="medium"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
    </Paper>
  );
};
