// src/hooks/useNotificationsLoading.ts - NEW NOTIFICATIONS LOADING HOOK
import { useState, useCallback } from 'react';
import { useLoading } from './useLoading';

export const useNotificationsLoading = () => {
  const { isLoading, startLoading, stopLoading } = useLoading(false);

  const handleRefresh = useCallback(() => {
    startLoading();
    // Simulate API call for notifications
    setTimeout(() => {
      stopLoading();
    }, 1500);
  }, [startLoading, stopLoading]);

  const handleInitialLoad = useCallback(() => {
    startLoading();
    // Simulate initial data loading
    setTimeout(() => {
      stopLoading();
    }, 1000);
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    handleRefresh,
    handleInitialLoad,
  };
};