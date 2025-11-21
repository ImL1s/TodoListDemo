Rails.application.routes.draw do
  # Health check endpoint
  get '/health', to: proc { [200, { 'Content-Type' => 'application/json' }, ['{"status":"ok"}']] }

  # API routes
  scope '/api' do
    resources :todos
  end
end
