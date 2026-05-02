

const VALID_STACKS = ['frontend', 'backend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

function validateParams(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) {
    throw new Error(`Invalid stack: "${stack}". Must be one of: ${VALID_STACKS.join(', ')}`);
  }
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(`Invalid level: "${level}". Must be one of: ${VALID_LEVELS.join(', ')}`);
  }
  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new Error('Log message must be a non-empty string.');
  }
}


function createLogger(logApiUrl, authToken) {
  return async function Log(stack, level, pkg, message) {
    try {
      validateParams(stack, level, pkg, message);

      const payload = {
        stack,
        level,
        package: pkg,
        message,
      };

      const response = await fetch(logApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(`[LogMiddleware] Server responded with ${response.status} for log: ${message}`);
      }
    } catch (err) {
      console.warn('[LogMiddleware] Failed to send log:', err.message);
    }
  };
}

module.exports = { createLogger };
