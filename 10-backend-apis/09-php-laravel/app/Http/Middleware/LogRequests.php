<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = round((microtime(true) - $startTime) * 1000, 2);

        $logData = [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ];

        if ($response->getStatusCode() >= 500) {
            Log::error('Server error', $logData);
        } elseif ($response->getStatusCode() >= 400) {
            Log::warning('Client error', $logData);
        } else {
            Log::info('Request completed', $logData);
        }

        if ($duration > 100) {
            Log::warning('Slow request detected', [
                'path' => $request->path(),
                'duration_ms' => $duration,
            ]);
        }

        return $response;
    }
}
