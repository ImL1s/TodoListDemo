require 'rails_helper'

RSpec.describe Todo, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:text) }
    it { should validate_length_of(:text).is_at_most(500) }
    it { should validate_inclusion_of(:completed).in_array([true, false]) }
  end

  describe 'default values' do
    it 'sets completed to false for new records' do
      todo = Todo.new(text: 'Test todo')
      expect(todo.completed).to be false
    end

    it 'does not override completed if set explicitly' do
      todo = Todo.new(text: 'Test todo', completed: true)
      expect(todo.completed).to be true
    end
  end

  describe 'scopes' do
    let!(:completed_todo) { Todo.create(text: 'Completed todo', completed: true) }
    let!(:active_todo) { Todo.create(text: 'Active todo', completed: false) }
    let!(:older_todo) { Todo.create(text: 'Older todo', completed: false, created_at: 1.day.ago) }

    describe '.active' do
      it 'returns only active (not completed) todos' do
        expect(Todo.active).to contain_exactly(active_todo, older_todo)
      end
    end

    describe '.completed' do
      it 'returns only completed todos' do
        expect(Todo.completed).to contain_exactly(completed_todo)
      end
    end

    describe '.recent' do
      it 'returns todos ordered by created_at descending' do
        # older_todo was created 1 day ago, so it should be last
        todos = Todo.recent
        expect(todos.first.id).to be >= active_todo.id
        expect(todos.last).to eq(older_todo)
      end
    end
  end

  describe 'validations with invalid data' do
    it 'is invalid without text' do
      todo = Todo.new(completed: false)
      expect(todo).not_to be_valid
      expect(todo.errors[:text]).to include("can't be blank")
    end

    it 'is invalid with text longer than 500 characters' do
      todo = Todo.new(text: 'a' * 501, completed: false)
      expect(todo).not_to be_valid
      expect(todo.errors[:text]).to include('is too long (maximum is 500 characters)')
    end

    it 'is valid with text of exactly 500 characters' do
      todo = Todo.new(text: 'a' * 500, completed: false)
      expect(todo).to be_valid
    end

    it 'is valid with completed as false' do
      todo = Todo.new(text: 'Test', completed: false)
      expect(todo).to be_valid
    end

    it 'is valid with completed as true' do
      todo = Todo.new(text: 'Test', completed: true)
      expect(todo).to be_valid
    end
  end

  describe 'creating todos' do
    it 'successfully creates a valid todo' do
      expect {
        Todo.create(text: 'Test todo', completed: false)
      }.to change(Todo, :count).by(1)
    end

    it 'does not create an invalid todo' do
      expect {
        Todo.create(text: '', completed: false)
      }.not_to change(Todo, :count)
    end
  end
end
