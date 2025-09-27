import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Chat } from '../types/chat';

interface AppState {
  currentChat: Chat | null;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_CHAT'; payload: Chat | null }
  | { type: 'CLEAR_CHAT' };

const initialState: AppState = {
  currentChat: null,
  isLoading: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };
    
    case 'CLEAR_CHAT':
      return { ...state, currentChat: null };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}