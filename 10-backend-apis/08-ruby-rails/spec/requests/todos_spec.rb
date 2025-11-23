require 'rails_helper'

RSpec.describe 'Todos API', type: :request do
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end

  describe 'GET /api/todos' do
    context 'when there are no todos' do
      it 'returns an empty array' do
        get '/api/todos'
        expect(response).to have_http_status(:ok)
        expect(json_response).to eq([])
      end
    end

    context 'when there are todos' do
      let!(:todo1) { Todo.create(text: 'First todo', completed: false) }
      let!(:todo2) { Todo.create(text: 'Second todo', completed: true) }

      it 'returns all todos' do
        get '/api/todos'
        expect(response).to have_http_status(:ok)
        expect(json_response.length).to eq(2)
      end

      it 'returns todos in recent order (newest first)' do
        get '/api/todos'
        expect(response).to have_http_status(:ok)
        # Second todo was created later, so it should be first
        expect(json_response.first['id']).to eq(todo2.id)
        expect(json_response.last['id']).to eq(todo1.id)
      end
    end
  end

  describe 'GET /api/todos/:id' do
    context 'when the todo exists' do
      let!(:todo) { Todo.create(text: 'Test todo', completed: false) }

      it 'returns the todo' do
        get "/api/todos/#{todo.id}"
        expect(response).to have_http_status(:ok)
        expect(json_response['id']).to eq(todo.id)
        expect(json_response['text']).to eq('Test todo')
        expect(json_response['completed']).to be false
      end
    end

    context 'when the todo does not exist' do
      it 'returns 404 not found' do
        expect {
          get '/api/todos/9999'
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'POST /api/todos' do
    context 'with valid parameters' do
      let(:valid_params) do
        {
          todo: {
            text: 'New todo',
            completed: false
          }
        }
      end

      it 'creates a new todo' do
        expect {
          post '/api/todos', params: valid_params
        }.to change(Todo, :count).by(1)
      end

      it 'returns the created todo' do
        post '/api/todos', params: valid_params
        expect(response).to have_http_status(:created)
        expect(json_response['text']).to eq('New todo')
        expect(json_response['completed']).to be false
      end

      it 'creates a completed todo when specified' do
        post '/api/todos', params: { todo: { text: 'Completed task', completed: true } }
        expect(response).to have_http_status(:created)
        expect(json_response['completed']).to be true
      end
    end

    context 'with invalid parameters' do
      it 'does not create a todo with empty text' do
        expect {
          post '/api/todos', params: { todo: { text: '', completed: false } }
        }.not_to change(Todo, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to include("can't be blank")
      end

      it 'does not create a todo with text longer than 500 characters' do
        long_text = 'a' * 501
        expect {
          post '/api/todos', params: { todo: { text: long_text, completed: false } }
        }.not_to change(Todo, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to include('too long')
      end

      it 'returns error for missing text parameter' do
        expect {
          post '/api/todos', params: { todo: { completed: false } }
        }.not_to change(Todo, :count)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PUT /api/todos/:id' do
    let!(:todo) { Todo.create(text: 'Original text', completed: false) }

    context 'with valid parameters' do
      it 'updates the todo text' do
        put "/api/todos/#{todo.id}", params: { todo: { text: 'Updated text' } }
        expect(response).to have_http_status(:ok)
        expect(json_response['text']).to eq('Updated text')
        expect(todo.reload.text).to eq('Updated text')
      end

      it 'updates the todo completed status' do
        put "/api/todos/#{todo.id}", params: { todo: { completed: true } }
        expect(response).to have_http_status(:ok)
        expect(json_response['completed']).to be true
        expect(todo.reload.completed).to be true
      end

      it 'updates both text and completed status' do
        put "/api/todos/#{todo.id}", params: { todo: { text: 'New text', completed: true } }
        expect(response).to have_http_status(:ok)
        expect(json_response['text']).to eq('New text')
        expect(json_response['completed']).to be true
      end
    end

    context 'with invalid parameters' do
      it 'does not update with empty text' do
        put "/api/todos/#{todo.id}", params: { todo: { text: '' } }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to include("can't be blank")
        expect(todo.reload.text).to eq('Original text')
      end

      it 'does not update with text longer than 500 characters' do
        long_text = 'a' * 501
        put "/api/todos/#{todo.id}", params: { todo: { text: long_text } }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['error']).to include('too long')
      end
    end

    context 'when the todo does not exist' do
      it 'returns 404 not found' do
        expect {
          put '/api/todos/9999', params: { todo: { text: 'Updated' } }
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'DELETE /api/todos/:id' do
    context 'when the todo exists' do
      let!(:todo) { Todo.create(text: 'Todo to delete', completed: false) }

      it 'deletes the todo' do
        expect {
          delete "/api/todos/#{todo.id}"
        }.to change(Todo, :count).by(-1)
      end

      it 'returns a success message' do
        delete "/api/todos/#{todo.id}"
        expect(response).to have_http_status(:ok)
        expect(json_response['message']).to eq('Todo deleted successfully')
      end
    end

    context 'when the todo does not exist' do
      it 'returns 404 not found' do
        expect {
          delete '/api/todos/9999'
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  # Integration tests - Complete workflows
  describe 'complete CRUD workflow' do
    it 'creates, reads, updates, and deletes a todo' do
      # Create
      post '/api/todos', params: { todo: { text: 'Workflow test', completed: false } }
      expect(response).to have_http_status(:created)
      todo_id = json_response['id']

      # Read
      get "/api/todos/#{todo_id}"
      expect(response).to have_http_status(:ok)
      expect(json_response['text']).to eq('Workflow test')

      # Update
      put "/api/todos/#{todo_id}", params: { todo: { text: 'Updated workflow', completed: true } }
      expect(response).to have_http_status(:ok)
      expect(json_response['text']).to eq('Updated workflow')
      expect(json_response['completed']).to be true

      # Delete
      expect {
        delete "/api/todos/#{todo_id}"
      }.to change(Todo, :count).by(-1)
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'boundary conditions' do
    it 'handles text at maximum length (500 characters)' do
      max_text = 'a' * 500
      post '/api/todos', params: { todo: { text: max_text, completed: false } }
      expect(response).to have_http_status(:created)
      expect(json_response['text'].length).to eq(500)
    end

    it 'handles multiple todos correctly' do
      5.times do |i|
        post '/api/todos', params: { todo: { text: "Todo #{i}", completed: i.even? } }
      end

      get '/api/todos'
      expect(response).to have_http_status(:ok)
      expect(json_response.length).to eq(5)
    end
  end
end
