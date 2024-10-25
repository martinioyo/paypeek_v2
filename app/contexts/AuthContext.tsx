import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/config/firebase';
import { User } from 'firebase/auth';

interface AuthContextProps {
  user: User | null;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((usr) => {
      setUser(usr);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
