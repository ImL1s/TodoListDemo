import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="medium"
          autoFocus
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          sx={{ minWidth: '120px' }}
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
};
