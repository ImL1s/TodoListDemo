class TodosController < ApplicationController
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /api/todos
  def index
    @todos = Todo.recent
    render json: @todos
  end

  # GET /api/todos/:id
  def show
    render json: @todo
  end

  # POST /api/todos
  def create
    @todo = Todo.new(todo_params)

    if @todo.save
      render json: @todo, status: :created
    else
      render json: { error: @todo.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /api/todos/:id
  def update
    if @todo.update(todo_params)
      render json: @todo
    else
      render json: { error: @todo.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  # DELETE /api/todos/:id
  def destroy
    @todo.destroy
    render json: { message: 'Todo deleted successfully' }, status: :ok
  end

  private

  def set_todo
    @todo = Todo.find(params[:id])
  end

  def todo_params
    params.require(:todo).permit(:text, :completed)
  end
end
