# Notification System Design

## Stage 1

### Priority Algorithm

The priority algorithm identifies the top N most important unread notifications efficiently, without any database queries, using a weighted sort.

**Weight Assignment:**

| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

**Algorithm Steps:**

1. Fetch all notifications from the API (paginated, batched at 50/page)
2. Filter to unread notifications (tracked client-side via React Context)
3. Sort using a comparator:
   - Primary: type weight descending (Placement first)
   - Secondary: timestamp descending (newest first within same type)
4. Slice top N results

**Complexity:** O(U log U) where U = number of unread notifications.

**Maintaining Top 10 Efficiently:**

As new notifications arrive (on refresh), the same O(U log U) sort is re-applied to the updated unread set. Because the unread set and sort are computed in-memory using `useMemo`, React only recomputes when `readIds` or `allNotifications` actually changes — keeping re-renders minimal.

If the dataset grew very large (10,000+), the algorithm could be adapted to use a min-heap of size N, reducing complexity to O(U log N). For the current scale of campus notifications, the simple sort is the correct choice.

---

## Stage 2

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                        │
│                                                             │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────────┐    │
│  │  Pages   │──▶│  Hooks       │──▶│   API Layer     │    │
│  │ /notifs  │   │useNotifica-  │   │notifications    │    │
│  │ /priority│   │tions.js      │   │Api.js           │    │
│  └──────────┘   └──────────────┘   └────────┬────────┘    │
│       │                                      │             │
│       ▼                                      ▼             │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────────┐    │
│  │Components│   │  State       │   │ Logging         │    │
│  │Cards,    │◀──│notification  │   │ Middleware       │    │
│  │Sidebar,  │   │Store.js      │   │                 │    │
│  │Filter,   │   │(Context API) │   │                 │    │
│  │Pagination│   └──────────────┘   └────────┬────────┘    │
│  └──────────┘                               │             │
└─────────────────────────────────────────────┼─────────────┘
                                              │ POST /logs
                          ┌───────────────────▼──────────────┐
                          │    Evaluation Service API         │
                          │  GET  /notifications              │
                          │  POST /logs                       │
                          └──────────────────────────────────┘
```

### Component Design

| Component | Responsibility |
|-----------|---------------|
| `NotificationCard` | Renders a single notification with read/unread state, type badge, timestamp |
| `FilterBar` | Dropdown for filtering by notification type |
| `PaginationBar` | Prev/Next page controls |
| `Sidebar` | Desktop persistent + mobile temporary navigation drawer |
| `Header` | AppBar with mobile menu toggle and global unread badge |

### Data Flow

1. **Page mounts** → `useNotifications` hook fires → `fetchNotifications()` called with current `page` + `filterType`
2. **API returns** `{ notifications: [...] }` → stored in hook local state
3. **Notifications rendered** → each card reads `isRead(id)` from the Context store
4. **User clicks unread card** → `markAsRead(id)` called → Context updates `readIds` Set → card re-renders as dimmed/read
5. **Filter changes** → page resets to 1 → new API call fires
6. **Pagination** → `goToNextPage()` / `goToPrevPage()` → page state increments/decrements → new API call fires

### State Management

React Context API (`NotificationProvider`) manages:
- `readIds: Set<string>` — IDs of notifications marked as read
- `markAsRead(id)` — adds an ID to the set
- `markAllAsRead(ids)` — bulk update
- `isRead(id)` — read status check
- `getUnreadCount(notifications)` — derives unread count from a list

State is ephemeral (in-memory only). Notifications are never stored in a database, per requirements.

### Logging Strategy

The `Log(stack, level, package, message)` function is called at every significant application event:

| Event | Level | Package |
|-------|-------|---------|
| Page mount | `info` | `page` |
| API fetch start | `debug` | `api` |
| API fetch success | `info` | `api` |
| API fetch failure | `error` | `api` |
| Filter changed | `info` | `page` |
| Notification marked read | `info` | `state` |
| Hook loading | `debug` | `hook` |
| Hook error | `error` | `hook` |

Logging is fault-tolerant — all log calls are wrapped in try/catch and never propagate errors to the application.

### Priority Algorithm

See Stage 1 section above. The `getTopPriorityNotifications(notifications, readIds, topN)` utility in `utils/priorityHelper.js` implements this algorithm.

The Priority page fetches ALL notifications (paginated, up to page 20 as a safety cap) to ensure the global priority ranking is accurate regardless of which page the user is on.

### Folder Structure

```
notification_app_fe/
├── api/
│   └── notificationsApi.js      # HTTP layer — fetch and error handling
├── components/
│   ├── FilterBar.jsx             # Type filter dropdown
│   ├── Header.jsx                # AppBar with mobile toggle
│   ├── NotificationCard.jsx      # Individual notification display
│   ├── PaginationBar.jsx         # Prev/Next controls
│   └── Sidebar.jsx               # Navigation drawer
├── hooks/
│   └── useNotifications.js       # Pagination + fetch state hook
├── middleware/
│   └── loggingMiddleware.js      # Log() function → POST /logs
├── pages/
│   ├── _app.js                   # MUI ThemeProvider + Context setup
│   ├── _document.js              # Next.js SSR document
│   ├── index.js                  # Root redirect to /notifications
│   ├── notifications.js          # All Notifications page
│   └── priority.js               # Priority Inbox page
├── state/
│   └── notificationStore.js      # React Context + useReducer store
├── style/
│   └── theme.js                  # MUI custom theme
├── utils/
│   └── priorityHelper.js         # Timestamp format + priority sort
├── .env.local                    # Environment variables
├── next.config.js
└── package.json
```
