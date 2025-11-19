import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoInput from '../TodoInput.vue'

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
    selectionStart: vi.fn(),
    selectionEnd: vi.fn()
  },
  ImpactStyle: {
    Light: 'LIGHT',
    Medium: 'MEDIUM',
    Heavy: 'HEAVY'
  }
}))

describe('TodoInput', () => {
  it('renders input field', () => {
    const wrapper = mount(TodoInput)
    expect(wrapper.find('ion-input').exists()).toBe(true)
  })

  it('emits add-todo event with text when submitted', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('ion-input')

    // Set input value
    await input.setValue('New Todo')

    // Click add button
    await wrapper.find('ion-button').trigger('click')

    // Check emit
    expect(wrapper.emitted()).toHaveProperty('add-todo')
    expect(wrapper.emitted('add-todo')?.[0]).toEqual(['New Todo'])
  })

  it('does not emit add-todo event with empty text', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('ion-input')

    // Set empty value
    await input.setValue('   ')

    // Click add button
    await wrapper.find('ion-button').trigger('click')

    // Check no emit
    expect(wrapper.emitted('add-todo')).toBeFalsy()
  })

  it('clears input after submission', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('ion-input')

    // Set input value
    await input.setValue('New Todo')

    // Submit
    await wrapper.find('ion-button').trigger('click')

    // Check input is cleared
    expect(input.element.value).toBe('')
  })

  it('shows hint when input is focused', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('ion-input')

    // Initially hint should not be visible
    expect(wrapper.find('.input-hint').exists()).toBe(false)

    // Focus input
    await input.trigger('ionFocus')
    await wrapper.vm.$nextTick()

    // Hint should be visible
    expect(wrapper.find('.input-hint').exists()).toBe(true)
    expect(wrapper.find('.input-hint').text()).toContain('Press Enter or tap + to add')
  })

  it('hides hint when input is blurred', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('ion-input')

    // Focus and blur
    await input.trigger('ionFocus')
    await wrapper.vm.$nextTick()
    await input.trigger('ionBlur')
    await wrapper.vm.$nextTick()

    // Hint should not be visible
    expect(wrapper.find('.input-hint').exists()).toBe(false)
  })

  it('disables button when input is empty', () => {
    const wrapper = mount(TodoInput)
    const button = wrapper.find('ion-button')

    expect(button.attributes('disabled')).toBeDefined()
  })

  it('enables button when input has text', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('ion-input')
    const button = wrapper.find('ion-button')

    await input.setValue('Some text')
    await wrapper.vm.$nextTick()

    expect(button.attributes('disabled')).toBeUndefined()
  })
})
