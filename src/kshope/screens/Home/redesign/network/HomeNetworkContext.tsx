import React, { createContext, useContext, ReactNode } from 'react';
import NetworkInterruptionSheet from './NetworkInterruptionSheet';

export interface HomeNetworkContextType {
  networkError: boolean;
  isRetrying: boolean;
  retryErrorMessage: string | null;
  retry: () => Promise<void>;
}

const HomeNetworkContext = createContext<HomeNetworkContextType | null>(null);

export const useHomeNetwork = () => {
  const context = useContext(HomeNetworkContext);
  if (!context) {
    throw new Error('useHomeNetwork must be used within a HomeNetworkProvider');
  }
  return context;
};

export interface HomeNetworkProviderProps {
  children: ReactNode;
  value: HomeNetworkContextType;
}

export const HomeNetworkProvider: React.FC<HomeNetworkProviderProps> = ({
  children,
  value,
}) => {
  return (
    <HomeNetworkContext.Provider value={value}>
      {children}
      <NetworkInterruptionSheet
        visible={value.networkError}
        onRetry={value.retry}
        isRetrying={value.isRetrying}
        errorMessage={value.retryErrorMessage}
      />
    </HomeNetworkContext.Provider>
  );
};

export default HomeNetworkContext;
