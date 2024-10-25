import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/config/firebase';
import { User } from 'firebase/auth';



// This code defines an authentication context for a React application using Firebase. 
// It provides a way to manage and access the current user's authentication state throughout the application. 
// The AuthProvider component wraps the application and subscribes to Firebase authentication state changes, updating the context with the current user.


// Define the shape of the context's value
interface AuthContextProps {
  user: User | null; // The user can be a Firebase User object or null if not authenticated
}

// Create the AuthContext with a default value
export const AuthContext = createContext<AuthContextProps>({
  user: null, // Default value for the context is null (no user)
});

interface AuthProviderProps {
  children: ReactNode; // The children prop represents the components that will be wrapped by the provider
}

// AuthProvider component to wrap the application and provide authentication state
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // State to hold the current user
  const [user, setUser] = useState<User | null>(null);

  // Effect to subscribe to authentication state changes
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChanged((usr) => {
      setUser(usr); // Update the user state when auth state changes
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Provide the user state to the rest of the application
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};