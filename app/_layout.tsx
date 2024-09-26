import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { app } from '../config/firebase';

import { useColorScheme } from '@/hooks/useColorScheme';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="SalarySummary"
                    //  headerShown: true får pilen til at vise og sidetitel når man har navigeret til siden gennem router.push
                    options={{ headerShown: true, title: 'Salary Summary' }}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
        </ThemeProvider>
    );
}
