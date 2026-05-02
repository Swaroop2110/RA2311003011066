# Logging Middleware

A reusable logging middleware for frontend and backend applications to send structured logs to the central logging service.

## Usage

```javascript
const { createLogger } = require('logging_middleware');

const log = createLogger(process.env.LOG_API_URL, process.env.AUTH_TOKEN);

log('frontend', 'info', 'page', 'Notifications page mounted');
```

## API

`log(stack, level, pkg, message)`

- `stack`: "frontend" | "backend"
- `level`: "debug" | "info" | "warn" | "error" | "fatal"
- `pkg`: The package or module name
- `message`: Log message string
