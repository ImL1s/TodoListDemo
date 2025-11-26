class TodosController < ApplicationController
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /api/todos
  def index
    start_time = Time.now
    @todos = Todo.recent
    duration = ((Time.now - start_time) * 1000).round(2)

    Rails.logger.info "Todos retrieved: count=#{@todos.count}, duration=#{duration}ms"
    Rails.logger.warn "Slow operation detected: get_todos, duration=#{duration}ms" if duration > 100

    render json: @todos
  end

  # GET /api/todos/:id
  def show
    start_time = Time.now
    duration = ((Time.now - start_time) * 1000).round(2)

    Rails.logger.info "Todo retrieved: id=#{@todo.id}, duration=#{duration}ms"

    render json: @todo
  end

  # POST /api/todos
  def create
    start_time = Time.now
    @todo = Todo.new(todo_params)

    if @todo.save
      duration = ((Time.now - start_time) * 1000).round(2)
      Rails.logger.info "Todo created: id=#{@todo.id}, text=#{@todo.text}, duration=#{duration}ms"
      Rails.logger.warn "Slow operation detected: create_todo, duration=#{duration}ms" if duration > 100

      render json: @todo, status: :created
    else
      Rails.logger.warn "Failed to create todo: errors=#{@todo.errors.full_messages.join(', ')}"
      render json: { error: @todo.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /api/todos/:id
  def update
    start_time = Time.now

    if @todo.update(todo_params)
      duration = ((Time.now - start_time) * 1000).round(2)
      Rails.logger.info "Todo updated: id=#{@todo.id}, changes=#{todo_params.to_h}, duration=#{duration}ms"

      render json: @todo
    else
      Rails.logger.warn "Failed to update todo: id=#{@todo.id}, errors=#{@todo.errors.full_messages.join(', ')}"
      render json: { error: @todo.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  # DELETE /api/todos/:id
  def destroy
    start_time = Time.now
    todo_id = @todo.id
    @todo.destroy
    duration = ((Time.now - start_time) * 1000).round(2)

    Rails.logger.info "Todo deleted: id=#{todo_id}, duration=#{duration}ms"

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
