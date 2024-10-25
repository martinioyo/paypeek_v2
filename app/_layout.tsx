import { Slot } from 'expo-router';
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
