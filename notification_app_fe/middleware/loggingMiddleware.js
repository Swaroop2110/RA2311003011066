

const LOG_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/logs`;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN;

const VALID_STACKS = ['frontend', 'backend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  'api', 'component', 'hook', 'page', 'state', 'style',
  
  'auth', 'config', 'middleware', 'utils',
];


function validateParams(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) {
    throw new Error(`Invalid stack: "${stack}". Must be one of: ${VALID_STACKS.join(', ')}`);
  }
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(`Invalid level: "${level}". Must be one of: ${VALID_LEVELS.join(', ')}`);
  }
  if (!VALID_PACKAGES.includes(pkg)) {
    throw new Error(`Invalid package: "${pkg}". Must be one of: ${VALID_PACKAGES.join(', ')}`);
  }
  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new Error('Log message must be a non-empty string.');
  }
}


async function Log(stack, level, pkg, message) {
  try {
    validateParams(stack, level, pkg, message);

    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      
      
      console.warn(`[LogMiddleware] Server responded with ${response.status} for log: ${message}`);
    }
  } catch (err) {
    
    
    console.warn('[LogMiddleware] Failed to send log:', err.message);
  }
}

export default Log;
