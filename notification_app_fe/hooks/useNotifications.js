import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications } from '../api/notificationsApi';

export function useNotifications({ filterType, limit = 10 }) {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (currentPage, currentFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({ page: currentPage, limit, notification_type: currentFilter });
      const fetchedNotifications = data?.notifications || [];
      setNotifications(fetchedNotifications);
      setHasMore(fetchedNotifications.length === limit);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPage(1, filterType);
    setPage(1);
  }, [filterType, fetchPage]);

  const goToNextPage = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage, filterType);
    }
  };

  const goToPrevPage = () => {
    if (page > 1 && !loading) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchPage(prevPage, filterType);
    }
  };

  const refresh = () => {
    fetchPage(page, filterType);
  };

  return {
    notifications,
    page,
    loading,
    error,
    hasMore,
    goToNextPage,
    goToPrevPage,
    refresh,
  };
}
