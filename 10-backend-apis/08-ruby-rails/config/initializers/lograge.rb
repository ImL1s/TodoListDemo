# Lograge configuration for structured logging
Rails.application.configure do
  # Enable lograge
  config.lograge.enabled = true

  # Use JSON formatter for structured logs
  config.lograge.formatter = Lograge::Formatters::Json.new

  # Add custom options to log output
  config.lograge.custom_options = lambda do |event|
    {
      time: event.time,
      remote_ip: event.payload[:remote_ip],
      user_agent: event.payload[:user_agent],
      exception: event.payload[:exception],
      exception_backtrace: event.payload[:exception_object]&.backtrace&.first(5)
    }.compact
  end

  # Add additional fields from request
  config.lograge.custom_payload do |controller|
    {
      host: controller.request.host,
      remote_ip: controller.request.remote_ip,
      user_agent: controller.request.user_agent
    }
  end

  # Log slow requests (over 100ms)
  config.lograge.base_controller_class = ['ActionController::API', 'ActionController::Base']

  # Set log level from environment variable
  config.log_level = ENV.fetch('LOG_LEVEL', 'info').to_sym
end
