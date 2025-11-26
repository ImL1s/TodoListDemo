import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
  Badge,
  Tooltip,
  Card,
  CardHeader,
  CardBody,
  useToast,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import type { Todo, FilterType } from './types'
import { STORAGE_KEYS } from './types'

/**
 * Main App Component
 *
 * Features:
 * - State management for todos and filters
 * - LocalStorage persistence
 * - Dark/Light mode toggle
 * - Responsive design
 * - Beautiful gradient background
 * - Toast notifications
 */
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()

  // Theme-aware colors
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const badgeBg = useColorModeValue('brand.500', 'brand.600')

  // Load todos from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem(STORAGE_KEYS.TODOS)
    if (storedTodos) {
      try {
        const parsed = JSON.parse(storedTodos)
        setTodos(parsed)
      } catch (error) {
        console.error('Failed to parse stored todos:', error)
        toast({
          title: 'Error Loading Todos',
          description: 'Failed to load saved todos from storage',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }, [toast])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos))
    } else {
      localStorage.removeItem(STORAGE_KEYS.TODOS)
    }
  }, [todos])

  // Add a new todo
  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos((prev) => [newTodo, ...prev])
  }

  // Toggle todo completion status
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? Date.now() : undefined,
            }
          : todo
      )
    )
  }

  // Delete a todo
  const handleDeleteTodo = (id: string) => {
    const todoToDelete = todos.find((t) => t.id === id)
    setTodos((prev) => prev.filter((todo) => todo.id !== id))

    if (todoToDelete) {
      toast({
        title: 'Todo Deleted',
        description: `"${todoToDelete.text}" has been removed`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  // Clear all completed todos
  const handleClearCompleted = () => {
    const completedCount = todos.filter((t) => t.completed).length
    setTodos((prev) => prev.filter((todo) => !todo.completed))

    toast({
      title: 'Completed Todos Cleared',
      description: `Removed ${completedCount} completed todo${completedCount !== 1 ? 's' : ''}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={8}
      px={4}
      transition="all 0.3s"
    >
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Card variant="elevated" bg={cardBg}>
            <CardHeader>
              <HStack justify="space-between" align="center">
                <Box>
                  <Heading
                    size="2xl"
                    bgGradient="linear(to-r, brand.400, purple.500, pink.500)"
                    bgClip="text"
                    fontWeight="extrabold"
                  >
                    Todo List
                  </Heading>
                  <HStack spacing={2} mt={2}>
                    <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>
                      React 18
                    </Badge>
                    <Badge
                      bg={badgeBg}
                      color="white"
                      fontSize="xs"
                      px={2}
                      py={1}
                    >
                      Chakra UI v2
                    </Badge>
                  </HStack>
                </Box>

                {/* Color Mode Toggle */}
                <Tooltip
                  label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                  placement="left"
                >
                  <IconButton
                    aria-label="Toggle color mode"
                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    size="lg"
                    variant="ghost"
                    colorScheme="brand"
                    _hover={{
                      transform: 'rotate(20deg) scale(1.1)',
                    }}
                    transition="all 0.3s"
                  />
                </Tooltip>
              </HStack>
            </CardHeader>

            <CardBody pt={0}>
              <VStack spacing={6} align="stretch">
                {/* Todo Input */}
                <TodoInput onAdd={handleAddTodo} />

                {/* Todo List */}
                <TodoList
                  todos={todos}
                  filter={filter}
                  onFilterChange={setFilter}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onClearCompleted={handleClearCompleted}
                />
              </VStack>
            </CardBody>
          </Card>

          {/* Footer */}
          <Box textAlign="center" opacity={0.6}>
            <Badge variant="subtle" colorScheme="gray" fontSize="xs">
              Built with Chakra UI - The Simple, Modular & Accessible Component Library
            </Badge>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
