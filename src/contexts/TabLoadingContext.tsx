// ✅ UPDATED: src/contexts/TabLoadingContext.tsx
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

// ✅ ADDED: General screen tracking interface
interface VisitedScreensState {
  [screenName: string]: boolean;
}

interface TabLoadingContextType {
  // Tab specific states
  loadingStates: TabLoadingState;
  visitedStates: TabVisitedState;

  // ✅ ADDED: General screen visited states (replaces VisitedScreensContext)
  visitedScreens: VisitedScreensState;

  // Tab specific actions
  setTabLoading: (tabName: keyof TabLoadingState, loading: boolean) => void;
  setTabVisited: (tabName: keyof TabVisitedState) => void;

  // ✅ ADDED: General screen actions (replaces VisitedScreensContext)
  markScreenAsVisited: (screenName: string) => void;
  hasVisitedScreen: (screenName: string) => boolean;

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

  // ✅ ADDED: General visited screens state
  const [visitedScreens, setVisitedScreens] = useState<VisitedScreensState>({});

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

  // ✅ ADDED: General screen visited functions
  const markScreenAsVisited = (screenName: string) => {
    setVisitedScreens((prev) => ({
      ...prev,
      [screenName]: true,
    }));
  };

  const hasVisitedScreen = (screenName: string): boolean => {
    return visitedScreens[screenName] === true;
  };

  const refreshTab = (tabName: keyof TabLoadingState) => {
    setTabLoading(tabName, true);
    setTimeout(() => {
      setTabLoading(tabName, false);
    }, 1500);
  };

  const value: TabLoadingContextType = {
    loadingStates,
    visitedStates,
    visitedScreens, // ✅ ADDED
    setTabLoading,
    setTabVisited,
    markScreenAsVisited, // ✅ ADDED
    hasVisitedScreen, // ✅ ADDED
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
