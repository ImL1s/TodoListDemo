/// <reference types="cypress" />

describe('Todo List E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    // Clear storage before each test
    cy.clearLocalStorage()
  })

  describe('Page Load', () => {
    it('should display the page title', () => {
      cy.contains('Todo List').should('be.visible')
    })

    it('should display the technology tag', () => {
      cy.contains('Ionic + Vue').should('be.visible')
    })

    it('should display empty state message', () => {
      cy.contains('No tasks yet').should('be.visible')
    })
  })

  describe('Adding Todos', () => {
    it('should add a new todo', () => {
      const todoText = 'Buy groceries'

      // Type in input
      cy.get('ion-input').type(todoText)

      // Click add button
      cy.get('ion-button').contains('ion-icon').click()

      // Verify todo appears
      cy.contains(todoText).should('be.visible')

      // Verify stats update
      cy.contains('1 / 1').should('be.visible')
    })

    it('should not add empty todo', () => {
      // Click add button without entering text
      cy.get('ion-button').contains('ion-icon').click()

      // Verify no todo added
      cy.contains('No tasks yet').should('be.visible')
    })

    it('should add multiple todos', () => {
      const todos = ['Task 1', 'Task 2', 'Task 3']

      todos.forEach(todo => {
        cy.get('ion-input').type(todo)
        cy.get('ion-button').contains('ion-icon').click()
      })

      // Verify all todos appear
      todos.forEach(todo => {
        cy.contains(todo).should('be.visible')
      })

      // Verify count
      cy.contains('3 / 3').should('be.visible')
    })

    it('should clear input after adding', () => {
      cy.get('ion-input').type('Test Todo')
      cy.get('ion-button').contains('ion-icon').click()

      cy.get('ion-input').should('have.value', '')
    })
  })

  describe('Toggling Todos', () => {
    beforeEach(() => {
      // Add a test todo
      cy.get('ion-input').type('Test Todo')
      cy.get('ion-button').contains('ion-icon').click()
    })

    it('should toggle todo completion', () => {
      // Toggle to completed
      cy.get('ion-checkbox').first().click()

      // Verify completed state
      cy.get('ion-item').first().should('have.class', 'completed')

      // Verify stats update
      cy.contains('0 / 1').should('be.visible')

      // Toggle back to active
      cy.get('ion-checkbox').first().click()

      // Verify active state
      cy.contains('1 / 1').should('be.visible')
    })

    it('should show toast notification on toggle', () => {
      cy.get('ion-checkbox').first().click()

      // Toast should appear
      cy.get('ion-toast').should('be.visible')
    })
  })

  describe('Filtering Todos', () => {
    beforeEach(() => {
      // Add multiple todos
      cy.get('ion-input').type('Active Todo 1')
      cy.get('ion-button').contains('ion-icon').click()

      cy.get('ion-input').type('Active Todo 2')
      cy.get('ion-button').contains('ion-icon').click()

      cy.get('ion-input').type('Completed Todo')
      cy.get('ion-button').contains('ion-icon').click()

      // Complete one todo
      cy.get('ion-checkbox').first().click()
      cy.wait(500) // Wait for state update
    })

    it('should show all todos by default', () => {
      cy.contains('Active Todo 1').should('be.visible')
      cy.contains('Active Todo 2').should('be.visible')
      cy.contains('Completed Todo').should('be.visible')
    })

    it('should filter active todos', () => {
      // Click Active filter
      cy.get('ion-segment-button').contains('Active').click()

      // Should show only active todos
      cy.contains('Active Todo 1').should('be.visible')
      cy.contains('Active Todo 2').should('be.visible')
      cy.contains('Completed Todo').should('not.exist')
    })

    it('should filter completed todos', () => {
      // Click Done filter
      cy.get('ion-segment-button').contains('Done').click()

      // Should show only completed todos
      cy.contains('Active Todo 1').should('be.visible')
      cy.contains('Active Todo 2').should('not.exist')
      cy.contains('Completed Todo').should('not.exist')
    })
  })

  describe('Deleting Todos', () => {
    beforeEach(() => {
      cy.get('ion-input').type('Test Todo')
      cy.get('ion-button').contains('ion-icon').click()
    })

    it('should delete todo with swipe action', () => {
      // Swipe left on item (simulate)
      cy.get('ion-item-sliding').first().trigger('mousedown', { which: 1 })
      cy.get('ion-item-sliding').first().trigger('mousemove', { clientX: -100 })
      cy.get('ion-item-sliding').first().trigger('mouseup')

      // Click delete button
      cy.get('ion-item-option').click()

      // Confirm deletion in alert
      cy.get('ion-alert').should('be.visible')
      cy.get('ion-alert button').contains('Delete').click()

      // Verify todo is deleted
      cy.contains('Test Todo').should('not.exist')
      cy.contains('No tasks yet').should('be.visible')
    })
  })

  describe('Clear Completed', () => {
    beforeEach(() => {
      // Add todos
      cy.get('ion-input').type('Todo 1')
      cy.get('ion-button').contains('ion-icon').click()

      cy.get('ion-input').type('Todo 2')
      cy.get('ion-button').contains('ion-icon').click()

      // Complete both
      cy.get('ion-checkbox').each($el => {
        cy.wrap($el).click()
      })
      cy.wait(500)
    })

    it('should show clear completed button when there are completed todos', () => {
      cy.get('ion-button').contains('Clear Completed').should('be.visible')
    })

    it('should clear all completed todos', () => {
      // Click clear completed
      cy.get('ion-button').contains('Clear Completed').click()

      // Confirm in alert
      cy.get('ion-alert button').contains('Clear').click()

      // Verify todos are cleared
      cy.contains('No tasks yet').should('be.visible')
    })
  })

  describe('Statistics', () => {
    it('should show correct statistics', () => {
      // Add 3 todos
      ['Todo 1', 'Todo 2', 'Todo 3'].forEach(todo => {
        cy.get('ion-input').type(todo)
        cy.get('ion-button').contains('ion-icon').click()
      })

      // Complete 2 todos
      cy.get('ion-checkbox').eq(0).click()
      cy.get('ion-checkbox').eq(1).click()
      cy.wait(500)

      // Check stats
      cy.contains('Total Tasks').parent().contains('3').should('be.visible')
      cy.contains('Completed').parent().contains('2').should('be.visible')
      cy.contains('Pending').parent().contains('1').should('be.visible')
      cy.contains('Progress').parent().contains('67%').should('be.visible')
    })

    it('should show progress bar', () => {
      cy.get('ion-input').type('Test Todo')
      cy.get('ion-button').contains('ion-icon').click()

      cy.get('ion-progress-bar').should('exist')
    })
  })

  describe('Pull to Refresh', () => {
    it('should refresh data on pull down', () => {
      // Add a todo
      cy.get('ion-input').type('Test Todo')
      cy.get('ion-button').contains('ion-icon').click()

      // Simulate pull to refresh
      cy.get('ion-content').trigger('touchstart', { clientY: 0 })
      cy.get('ion-content').trigger('touchmove', { clientY: 100 })
      cy.get('ion-content').trigger('touchend')

      // Refresher should appear
      cy.get('ion-refresher').should('exist')

      // Todo should still be visible after refresh
      cy.contains('Test Todo').should('be.visible')
    })
  })

  describe('Data Persistence', () => {
    it('should persist todos after page reload', () => {
      // Add todos
      cy.get('ion-input').type('Persistent Todo')
      cy.get('ion-button').contains('ion-icon').click()

      // Reload page
      cy.reload()

      // Todo should still be visible
      cy.contains('Persistent Todo').should('be.visible')
    })

    it('should persist todo completion status', () => {
      // Add and complete todo
      cy.get('ion-input').type('Test Todo')
      cy.get('ion-button').contains('ion-icon').click()
      cy.get('ion-checkbox').first().click()
      cy.wait(500)

      // Reload page
      cy.reload()

      // Todo should still be completed
      cy.get('ion-item').first().should('have.class', 'completed')
    })
  })
})
