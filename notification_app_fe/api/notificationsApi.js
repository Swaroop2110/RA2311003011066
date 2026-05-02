

import Log from '../middleware/loggingMiddleware';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN;

function buildHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AUTH_TOKEN}`,
  };
}


export async function fetchNotifications({ page = 1, limit = 10, notification_type = null } = {}) {
  await Log('frontend', 'info', 'api', `Fetching notifications — page=${page}, limit=${limit}, type=${notification_type || 'all'}`);

  const url = new URL(`${BASE_URL}/notifications`);
  url.searchParams.set('page', page);
  url.searchParams.set('limit', limit);
  if (notification_type) {
    url.searchParams.set('notification_type', notification_type);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      await Log('frontend', 'error', 'api', `Fetch notifications failed — status=${response.status}, body=${errorText}`);
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    await Log('frontend', 'info', 'api', `Notifications fetched successfully — count=${data?.notifications?.length ?? 0}`);
    return data;
  } catch (err) {
    await Log('frontend', 'error', 'api', `fetchNotifications threw: ${err.message}`);
    throw err;
  }
}


export async function fetchAllNotificationsForPriority(perPage = 10) {
  await Log('frontend', 'info', 'api', `Fetching all notifications for priority computation — batchSize=${perPage}`);

  let allNotifications = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const data = await fetchNotifications({ page, limit: perPage });
      const batch = data?.notifications ?? [];
      allNotifications = [...allNotifications, ...batch];

      
      if (batch.length < perPage) {
        hasMore = false;
      } else {
        page += 1;
      }

      
      if (page > 20) {
        await Log('frontend', 'warn', 'api', 'Priority fetch reached page cap of 20 — stopping early');
        break;
      }
    }

    await Log('frontend', 'info', 'api', `Priority fetch complete — totalFetched=${allNotifications.length}`);
    return allNotifications;
  } catch (err) {
    await Log('frontend', 'error', 'api', `fetchAllNotificationsForPriority threw: ${err.message}`);
    throw err;
  }
}
