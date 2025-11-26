<?php

return [
    // Custom JSON logging channel
    'json' => [
        'driver' => 'monolog',
        'handler' => \Monolog\Handler\StreamHandler::class,
        'formatter' => \Monolog\Formatter\JsonFormatter::class,
        'with' => [
            'stream' => 'php://stdout',
        ],
        'level' => env('LOG_LEVEL', 'info'),
    ],
    
    // Performance logging channel
    'performance' => [
        'driver' => 'monolog',
        'handler' => \Monolog\Handler\StreamHandler::class,
        'formatter' => \Monolog\Formatter\JsonFormatter::class,
        'with' => [
            'stream' => storage_path('logs/performance.log'),
        ],
        'level' => 'info',
    ],
];
