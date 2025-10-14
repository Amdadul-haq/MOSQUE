// src/contexts/VisitedScreensContext.tsx - NEW CONTEXT
import React, { createContext, useContext, useState, ReactNode } from "react";

interface VisitedScreensContextType {
  visitedScreens: Set<string>;
  markScreenAsVisited: (screenName: string) => void;
  hasVisitedScreen: (screenName: string) => boolean;
}

const VisitedScreensContext = createContext<
  VisitedScreensContextType | undefined
>(undefined);

interface VisitedScreensProviderProps {
  children: ReactNode;
}

export const VisitedScreensProvider: React.FC<VisitedScreensProviderProps> = ({
  children,
}) => {
  const [visitedScreens, setVisitedScreens] = useState<Set<string>>(new Set());

  const markScreenAsVisited = (screenName: string) => {
    setVisitedScreens((prev) => {
      const newSet = new Set(prev);
      newSet.add(screenName);
      return newSet;
    });
  };

  const hasVisitedScreen = (screenName: string) => {
    return visitedScreens.has(screenName);
  };

  const value: VisitedScreensContextType = {
    visitedScreens,
    markScreenAsVisited,
    hasVisitedScreen,
  };

  return (
    <VisitedScreensContext.Provider value={value}>
      {children}
    </VisitedScreensContext.Provider>
  );
};

export const useVisitedScreens = (): VisitedScreensContextType => {
  const context = useContext(VisitedScreensContext);
  if (context === undefined) {
    throw new Error(
      "useVisitedScreens must be used within a VisitedScreensProvider"
    );
  }
  return context;
};
