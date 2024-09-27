import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/config/firebase';

export default function ProfileScreen() {
    const router = useRouter();
    const user = auth.currentUser;

    if (!user) {
        // Redirect to login if not authenticated
        router.replace('/(tabs)');
        return null;
    }

    const handleUploadPayslip = () => {
        router.replace('/(tabs)/UploadPayslip');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {user.email}</Text>
            <Text style={styles.text}>You are logged in!</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={handleUploadPayslip}
            >
                <Text style={styles.buttonText}>Go to Upload Payslip</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#A1CEDC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#2c3e50',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        color: '#2c3e50',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1D3D47',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
