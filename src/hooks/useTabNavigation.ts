import { useCallback } from 'react';
import { useTabLoading } from '../contexts/TabLoadingContext';

type TabName = 'home' | 'donations' | 'mosqueInfo' | 'profile';

interface UseTabNavigationReturn {
  isLoading: boolean;
  hasVisited: boolean;
  handleTabFocus: () => void;
  handleRefresh: () => void;
}

export const useTabNavigation = (tabName: TabName): UseTabNavigationReturn => {
  const { 
    loadingStates, 
    visitedStates, 
    setTabLoading, 
    setTabVisited, 
    refreshTab 
  } = useTabLoading();

  const handleTabFocus = useCallback(() => {
    // If this is the first time visiting this tab, set loading
    if (!visitedStates[tabName]) {
      setTabLoading(tabName, true);
      setTabVisited(tabName);
      
      // Simulate API call - will be replaced with actual data fetching
      setTimeout(() => {
        setTabLoading(tabName, false);
      }, 1200);
    }
  }, [tabName, visitedStates[tabName], setTabLoading, setTabVisited]);

  const handleRefresh = useCallback(() => {
    refreshTab(tabName);
  }, [tabName, refreshTab]);

  return {
    isLoading: loadingStates[tabName],
    hasVisited: visitedStates[tabName],
    handleTabFocus,
    handleRefresh,
  };
};