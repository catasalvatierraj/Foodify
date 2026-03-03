import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  goal: 'maintain' | 'lose_weight' | 'gain_muscle' | 'improve_health';
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: number; // grams
  date: string;
  imageUrl?: string;
}

interface AppContextType {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  history: FoodEntry[];
  addFoodEntry: (entry: FoodEntry) => void;
  scannedFood: FoodEntry | null;
  setScannedFood: (food: FoodEntry | null) => void;
}

const defaultProfile: UserProfile = {
  name: 'Usuario',
  age: 25,
  sex: 'male',
  weight: 70,
  height: 175,
  goal: 'maintain',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutri-profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [history, setHistory] = useState<FoodEntry[]>(() => {
    const saved = localStorage.getItem('nutri-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [scannedFood, setScannedFood] = useState<FoodEntry | null>(null);

  const updateProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('nutri-profile', JSON.stringify(p));
  };

  const addFoodEntry = (entry: FoodEntry) => {
    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem('nutri-history', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{ profile, setProfile: updateProfile, history, addFoodEntry, scannedFood, setScannedFood }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
