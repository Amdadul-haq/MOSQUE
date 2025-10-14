//src/contexts/TabLoadingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TabLoadingState {
  home: boolean;
  donations: boolean;
  mosqueInfo: boolean;
  profile: boolean;
}

interface TabVisitedState {
  home: boolean;
  donations: boolean;
  mosqueInfo: boolean;
  profile: boolean;
}

interface TabLoadingContextType {
  loadingStates: TabLoadingState;
  visitedStates: TabVisitedState;
  setTabLoading: (tabName: keyof TabLoadingState, loading: boolean) => void;
  setTabVisited: (tabName: keyof TabVisitedState) => void;
  refreshTab: (tabName: keyof TabLoadingState) => void;
}

const TabLoadingContext = createContext<TabLoadingContextType | undefined>(
  undefined
);

interface TabLoadingProviderProps {
  children: ReactNode;
}

export const TabLoadingProvider: React.FC<TabLoadingProviderProps> = ({
  children,
}) => {
  const [loadingStates, setLoadingStates] = useState<TabLoadingState>({
    home: false,
    donations: false,
    mosqueInfo: false,
    profile: false,
  });

  const [visitedStates, setVisitedStates] = useState<TabVisitedState>({
    home: false,
    donations: false,
    mosqueInfo: false,
    profile: false,
  });

  const setTabLoading = (tabName: keyof TabLoadingState, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [tabName]: loading,
    }));
  };

  const setTabVisited = (tabName: keyof TabVisitedState) => {
    setVisitedStates((prev) => ({
      ...prev,
      [tabName]: true,
    }));
  };

  const refreshTab = (tabName: keyof TabLoadingState) => {
    setTabLoading(tabName, true);
    // Simulate API call - will be replaced with actual data fetching
    setTimeout(() => {
      setTabLoading(tabName, false);
    }, 1500);
  };

  const value: TabLoadingContextType = {
    loadingStates,
    visitedStates,
    setTabLoading,
    setTabVisited,
    refreshTab,
  };

  return (
    <TabLoadingContext.Provider value={value}>
      {children}
    </TabLoadingContext.Provider>
  );
};

export const useTabLoading = (): TabLoadingContextType => {
  const context = useContext(TabLoadingContext);
  if (context === undefined) {
    throw new Error("useTabLoading must be used within a TabLoadingProvider");
  }
  return context;
};
