import { memo } from 'react'
import {
  Box,
  Checkbox,
  IconButton,
  Text,
  HStack,
  useColorModeValue,
  Tooltip,
  Badge,
} from '@chakra-ui/react'
import { DeleteIcon, TimeIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

// Framer Motion wrapper for Box
const MotionBox = motion(Box)

/**
 * TodoItem Component
 *
 * Displays a single todo item with:
 * - Checkbox for completion toggle
 * - Strike-through animation when completed
 * - Delete button with hover effect
 * - Timestamp badge
 * - Smooth animations and transitions
 * - Memoized for performance
 */
function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // Theme-aware colors
  const itemBg = useColorModeValue('white', 'gray.700')
  const itemBorder = useColorModeValue('gray.200', 'gray.600')
  const completedTextColor = useColorModeValue('gray.400', 'gray.500')
  const activeTextColor = useColorModeValue('gray.800', 'gray.100')
  const hoverBg = useColorModeValue('gray.50', 'gray.600')
  const deleteBg = useColorModeValue('red.50', 'red.900')

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      bg={itemBg}
      borderWidth="1px"
      borderColor={itemBorder}
      borderRadius="lg"
      p={4}
      _hover={{
        bg: hoverBg,
        transform: 'translateX(4px)',
        boxShadow: 'md',
      }}
    >
      <HStack spacing={3} align="center">
        {/* Checkbox */}
        <Checkbox
          isChecked={todo.completed}
          onChange={() => onToggle(todo.id)}
          size="lg"
          colorScheme="brand"
          sx={{
            '& .chakra-checkbox__control': {
              borderRadius: 'md',
            },
          }}
        />

        {/* Todo Text */}
        <Box flex={1}>
          <Text
            fontSize="md"
            fontWeight="medium"
            color={todo.completed ? completedTextColor : activeTextColor}
            textDecoration={todo.completed ? 'line-through' : 'none'}
            transition="all 0.3s"
          >
            {todo.text}
          </Text>

          {/* Timestamp Badge */}
          <HStack spacing={2} mt={1}>
            <Badge
              colorScheme={todo.completed ? 'green' : 'blue'}
              variant="subtle"
              fontSize="xs"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <TimeIcon boxSize={2.5} />
              {formatTime(todo.createdAt)}
            </Badge>
            {todo.completed && todo.completedAt && (
              <Badge
                colorScheme="green"
                variant="solid"
                fontSize="xs"
              >
                Completed
              </Badge>
            )}
          </HStack>
        </Box>

        {/* Delete Button */}
        <Tooltip label="Delete todo" placement="top" hasArrow>
          <IconButton
            aria-label="Delete todo"
            icon={<DeleteIcon />}
            onClick={() => onDelete(todo.id)}
            size="sm"
            colorScheme="red"
            variant="ghost"
            _hover={{
              bg: deleteBg,
              transform: 'scale(1.1)',
            }}
            transition="all 0.2s"
          />
        </Tooltip>
      </HStack>
    </MotionBox>
  )
}

// Memoize component to prevent unnecessary re-renders
export default memo(TodoItem)
