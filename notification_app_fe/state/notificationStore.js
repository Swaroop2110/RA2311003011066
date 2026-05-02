

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import Log from '../middleware/loggingMiddleware';


const initialState = {
  readIds: new Set(),           
};


export const ACTIONS = {
  MARK_READ: 'MARK_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
  RESET: 'RESET',
};


function notificationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MARK_READ: {
      const newReadIds = new Set(state.readIds);
      newReadIds.add(action.payload.id);
      return { ...state, readIds: newReadIds };
    }
    case ACTIONS.MARK_ALL_READ: {
      const allIds = new Set(action.payload.ids);
      return { ...state, readIds: allIds };
    }
    case ACTIONS.RESET: {
      return initialState;
    }
    default:
      return state;
  }
}


const NotificationContext = createContext(null);


export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  
  const markAsRead = useCallback(async (id) => {
    if (!state.readIds.has(id)) {
      dispatch({ type: ACTIONS.MARK_READ, payload: { id } });
      await Log('frontend', 'info', 'state', `Notification marked as read — id=${id}`);
    }
  }, [state.readIds]);

  
  const markAllAsRead = useCallback(async (ids) => {
    dispatch({ type: ACTIONS.MARK_ALL_READ, payload: { ids } });
    await Log('frontend', 'info', 'state', `All notifications marked as read — count=${ids.length}`);
  }, []);

  
  const isRead = useCallback((id) => {
    return state.readIds.has(id);
  }, [state.readIds]);

  
  const getUnreadCount = useCallback((notifications = []) => {
    return notifications.filter((n) => !state.readIds.has(n.ID)).length;
  }, [state.readIds]);

  const value = {
    readIds: state.readIds,
    markAsRead,
    markAllAsRead,
    isRead,
    getUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}


export function useNotificationStore() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationStore must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
