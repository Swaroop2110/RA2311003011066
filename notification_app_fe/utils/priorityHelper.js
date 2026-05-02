


const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};


export function parseTimestamp(ts) {
  if (!ts) return new Date(0);
  
  return new Date(ts.replace(' ', 'T'));
}


export function formatTimestamp(ts) {
  const date = parseTimestamp(ts);
  if (isNaN(date.getTime())) return ts; 

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}


export function getTypeWeight(type) {
  return TYPE_WEIGHT[type] ?? 0;
}


export function priorityComparator(a, b) {
  const weightDiff = getTypeWeight(b.Type) - getTypeWeight(a.Type);
  if (weightDiff !== 0) return weightDiff;

  
  return parseTimestamp(b.Timestamp) - parseTimestamp(a.Timestamp);
}


export function getTopPriorityNotifications(notifications, readIds, topN = 10) {
  const unread = notifications.filter((n) => !readIds.has(n.ID));
  const sorted = [...unread].sort(priorityComparator);
  return sorted.slice(0, topN);
}


export function getTypeColor(type) {
  switch (type) {
    case 'Placement': return 'secondary';
    case 'Result':    return 'primary';
    case 'Event':     return 'success';
    default:          return 'default';
  }
}


export function getTypeIcon(type) {
  switch (type) {
    case 'Placement': return '🏢';
    case 'Result':    return '📊';
    case 'Event':     return '📅';
    default:          return '🔔';
  }
}
