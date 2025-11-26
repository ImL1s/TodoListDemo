import { useMemo } from 'react'
import {
  VStack,
  HStack,
  Button,
  ButtonGroup,
  Text,
  Box,
  useColorModeValue,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Progress,
  Fade,
} from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import TodoItem from './TodoItem'
import type { Todo, FilterType, TodoStats } from '../types'

interface TodoListProps {
  todos: Todo[]
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onClearCompleted: () => void
}

/**
 * TodoList Component
 *
 * Main list component that handles:
 * - Filtering (all, active, completed)
 * - Statistics display
 * - Progress visualization
 * - Bulk actions (clear completed)
 * - Empty states
 * - Smooth animations for list items
 */
export default function TodoList({
  todos,
  filter,
  onFilterChange,
  onToggle,
  onDelete,
  onClearCompleted,
}: TodoListProps) {
  // Theme-aware colors
  const statBg = useColorModeValue('gray.50', 'gray.800')
  const dividerColor = useColorModeValue('gray.200', 'gray.600')
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400')

  // Calculate statistics
  const stats: TodoStats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const active = total - completed
    const completionRate = total > 0 ? (completed / total) * 100 : 0

    return { total, active, completed, completionRate }
  }, [todos])

  // Filter todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed)
      case 'completed':
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }, [todos, filter])

  // Empty state messages
  const getEmptyMessage = () => {
    switch (filter) {
      case 'active':
        return 'No active todos. Great job!'
      case 'completed':
        return 'No completed todos yet. Start checking off your tasks!'
      default:
        return 'No todos yet. Add one above to get started!'
    }
  }

  return (
    <VStack spacing={6} width="100%" align="stretch">
      {/* Statistics Section */}
      {todos.length > 0 && (
        <Box bg={statBg} p={4} borderRadius="lg">
          <StatGroup>
            <Stat>
              <StatLabel fontSize="sm">Total</StatLabel>
              <StatNumber fontSize="2xl">{stats.total}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="sm">Active</StatLabel>
              <StatNumber fontSize="2xl" color="blue.500">
                {stats.active}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="sm">Completed</StatLabel>
              <StatNumber fontSize="2xl" color="green.500">
                {stats.completed}
              </StatNumber>
            </Stat>
          </StatGroup>

          {/* Progress Bar */}
          <Box mt={4}>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium">
                Progress
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="brand.500">
                {Math.round(stats.completionRate)}%
              </Text>
            </HStack>
            <Progress
              value={stats.completionRate}
              size="sm"
              colorScheme="brand"
              borderRadius="full"
              hasStripe
              isAnimated
            />
          </Box>
        </Box>
      )}

      {/* Filter Buttons */}
      <HStack justify="space-between" align="center">
        <ButtonGroup size="sm" isAttached variant="outline">
          <Button
            onClick={() => onFilterChange('all')}
            colorScheme={filter === 'all' ? 'brand' : 'gray'}
            variant={filter === 'all' ? 'solid' : 'outline'}
          >
            All ({stats.total})
          </Button>
          <Button
            onClick={() => onFilterChange('active')}
            colorScheme={filter === 'active' ? 'brand' : 'gray'}
            variant={filter === 'active' ? 'solid' : 'outline'}
          >
            Active ({stats.active})
          </Button>
          <Button
            onClick={() => onFilterChange('completed')}
            colorScheme={filter === 'completed' ? 'brand' : 'gray'}
            variant={filter === 'completed' ? 'solid' : 'outline'}
          >
            Completed ({stats.completed})
          </Button>
        </ButtonGroup>

        {/* Clear Completed Button */}
        {stats.completed > 0 && (
          <Button
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={onClearCompleted}
          >
            Clear Completed
          </Button>
        )}
      </HStack>

      <Divider borderColor={dividerColor} />

      {/* Todo Items List */}
      <VStack spacing={3} align="stretch">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredTodos.length === 0 && (
          <Fade in>
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color={emptyTextColor}>
                {getEmptyMessage()}
              </Text>
            </Box>
          </Fade>
        )}
      </VStack>

      {/* Footer Info */}
      {todos.length > 0 && (
        <Box textAlign="center" pt={4}>
          <Text fontSize="xs" color={emptyTextColor}>
            Showing {filteredTodos.length} of {stats.total} todos
          </Text>
        </Box>
      )}
    </VStack>
  )
}
