# config/initializers/rack_attack.rb

class Rack::Attack
  # Throttle all requests by IP (100 requests per minute)
  throttle('req/ip', limit: ENV.fetch('RATE_LIMIT_MAX', 100).to_i, period: ENV.fetch('RATE_LIMIT_WINDOW', 60).to_i.seconds) do |req|
    req.ip
  end

  # Throttle POST requests to /api/todos by IP address
  throttle('todos/ip', limit: 20, period: 1.minute) do |req|
    if req.path == '/api/todos' && req.post?
      req.ip
    end
  end

  # Block suspicious requests
  blocklist('fail2ban pentesters') do |req|
    # Block IPs that make too many failed requests
    Rack::Attack::Fail2Ban.filter("pentesters-#{req.ip}", maxretry: 5, findtime: 10.minutes, bantime: 1.hour) do
      # The count for the IP is incremented if the return value is truthy
      CGI.unescape(req.query_string) =~ %r{/etc/passwd} ||
      req.path.include?('/etc/passwd') ||
      req.path.include?('..') ||
      req.path.include?('<script')
    end
  end

  # Custom throttle response
  self.throttled_responder = lambda do |env|
    retry_after = env['rack.attack.match_data'][:period]
    [
      429,
      {
        'Content-Type' => 'application/json',
        'Retry-After' => retry_after.to_s,
        'X-RateLimit-Limit' => env['rack.attack.match_data'][:limit].to_s,
        'X-RateLimit-Remaining' => '0',
        'X-RateLimit-Reset' => (env['rack.attack.match_data'][:period] + Time.now.to_i).to_s
      },
      [{ error: 'Too many requests. Please try again later.' }.to_json]
    ]
  end
end
