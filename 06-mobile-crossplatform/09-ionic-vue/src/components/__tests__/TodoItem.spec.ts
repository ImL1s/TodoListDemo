import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from '../TodoItem.vue'
import type { Todo } from '@/types'

// Mock Capacitor
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
    getPlatform: () => 'web'
  }
}))

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: vi.fn(),
    notification: vi.fn(),
    selectionChanged: vi.fn()
  },
  ImpactStyle: {
    Light: 'LIGHT',
    Medium: 'MEDIUM',
    Heavy: 'HEAVY'
  },
  NotificationType: {
    Success: 'SUCCESS',
    Warning: 'WARNING',
    Error: 'ERROR'
  }
}))

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test Todo',
    completed: false,
    createdAt: new Date().toISOString()
  }

  it('renders todo text', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    expect(wrapper.text()).toContain('Test Todo')
  })

  it('renders completed todo with line-through', () => {
    const completedTodo: Todo = {
      ...mockTodo,
      completed: true
    }

    const wrapper = mount(TodoItem, {
      props: { todo: completedTodo }
    })

    const textElement = wrapper.find('.completed-text')
    expect(textElement.exists()).toBe(true)
  })

  it('emits toggle event when checkbox is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    await wrapper.find('ion-checkbox').trigger('ionChange')

    expect(wrapper.emitted()).toHaveProperty('toggle')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    await wrapper.find('ion-item-option').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('delete')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })

  it('shows success icon when todo is completed', () => {
    const completedTodo: Todo = {
      ...mockTodo,
      completed: true
    }

    const wrapper = mount(TodoItem, {
      props: { todo: completedTodo }
    })

    const successIcon = wrapper.find('ion-icon[color="success"]')
    expect(successIcon.exists()).toBe(true)
  })

  it('displays formatted date', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    const timestamp = wrapper.find('.timestamp')
    expect(timestamp.exists()).toBe(true)
    expect(timestamp.text()).toBeTruthy()
  })

  it('applies correct checkbox color based on completion status', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    const checkbox = wrapper.find('ion-checkbox')
    expect(checkbox.attributes('color')).toBe('primary')

    const completedWrapper = mount(TodoItem, {
      props: { todo: { ...mockTodo, completed: true } }
    })

    const completedCheckbox = completedWrapper.find('ion-checkbox')
    expect(completedCheckbox.attributes('color')).toBe('success')
  })
})
