import { useState } from 'react'
import {
  HStack,
  Input,
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

interface TodoInputProps {
  onAdd: (text: string) => void
}

/**
 * TodoInput Component
 *
 * A controlled input component for adding new todos
 * Features:
 * - Input validation (min 3 characters)
 * - Toast notifications for feedback
 * - Keyboard support (Enter to submit)
 * - Auto-focus after submission
 * - Responsive design
 */
export default function TodoInput({ onAdd }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('')
  const toast = useToast()

  // Theme-aware colors
  const inputBg = useColorModeValue('white', 'gray.700')
  const inputBorder = useColorModeValue('gray.200', 'gray.600')

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim()

    // Validation: minimum 3 characters
    if (trimmedValue.length < 3) {
      toast({
        title: 'Invalid Input',
        description: 'Todo must be at least 3 characters long',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
      return
    }

    // Add the todo
    onAdd(trimmedValue)
    setInputValue('')

    // Success feedback
    toast({
      title: 'Todo Added',
      description: `"${trimmedValue}" has been added to your list`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <HStack spacing={3} width="100%">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="What needs to be done?"
        size="lg"
        variant="filled"
        bg={inputBg}
        borderColor={inputBorder}
        borderWidth="1px"
        _placeholder={{
          color: useColorModeValue('gray.400', 'gray.500')
        }}
        flex={1}
        autoFocus
      />
      <Button
        onClick={handleSubmit}
        colorScheme="brand"
        size="lg"
        leftIcon={<AddIcon />}
        px={8}
        isDisabled={inputValue.trim().length < 3}
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        }}
        transition="all 0.2s"
      >
        Add
      </Button>
    </HStack>
  )
}
