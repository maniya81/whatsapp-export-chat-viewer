import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Chat, SearchResult } from '../types/chat';
import { db } from '../utils/database';
import { SearchEngine } from '../utils/searchEngine';

interface AppState {
  chats: Chat[];
  activeChat: Chat | null;
  searchQuery: string;
  searchResults: SearchResult[];
  isLoading: boolean;
  searchEngine: SearchEngine | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'ADD_CHAT'; payload: Chat }
  | { type: 'SET_ACTIVE_CHAT'; payload: Chat | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: SearchResult[] }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'UPDATE_SEARCH_ENGINE'; payload: SearchEngine };

const initialState: AppState = {
  chats: [],
  activeChat: null,
  searchQuery: '',
  searchResults: [],
  isLoading: false,
  searchEngine: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    
    case 'ADD_CHAT':
      return { 
        ...state, 
        chats: [action.payload, ...state.chats.filter(chat => chat.id !== action.payload.id)]
      };
    
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    
    case 'DELETE_CHAT':
      const filteredChats = state.chats.filter(chat => chat.id !== action.payload);
      return {
        ...state,
        chats: filteredChats,
        activeChat: state.activeChat?.id === action.payload ? null : state.activeChat
      };
    
    case 'UPDATE_SEARCH_ENGINE':
      return { ...state, searchEngine: action.payload };
    
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

  // Load chats from IndexedDB on app start
  useEffect(() => {
    async function loadChats() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const chats = await db.getChats();
        dispatch({ type: 'SET_CHATS', payload: chats });
        
        // Initialize search engine
        const searchEngine = new SearchEngine(chats);
        dispatch({ type: 'UPDATE_SEARCH_ENGINE', payload: searchEngine });
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    
    loadChats();
  }, []);

  // Update search engine when chats change
  useEffect(() => {
    if (state.chats.length > 0) {
      const searchEngine = new SearchEngine(state.chats);
      dispatch({ type: 'UPDATE_SEARCH_ENGINE', payload: searchEngine });
    }
  }, [state.chats]);

  // Perform search when query changes
  useEffect(() => {
    if (state.searchEngine && state.searchQuery.trim()) {
      const results = state.searchEngine.search(state.searchQuery);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
    } else {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    }
  }, [state.searchQuery, state.searchEngine]);

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