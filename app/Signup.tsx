import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import globalStyles from './styles/globalStyles';
import { AuthContext } from './contexts/AuthContext';

export default function SignupScreen() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            router.replace('/(tabs)/UserProfil');
        }
    }, [user]);

    const handleSignup = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        // This regular expression pattern is used to validate email addresses.
        // It ensures that the email follows the general format of "local-part@domain".
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if the email address is valid
        if (!emailPattern.test(email)) {
            console.log('Invalid email');
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // Check if the password is at least 6 characters long
        if (password.length < 6) {
            console.log('Password too short');
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                console.log('User signed up:', userCredential.user);
                // Redirect to UploadPayslip screen
                router.replace('/UserProfil');
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Signup Error', error.message);
            });
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Create an Account</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
                style={globalStyles.button}
                onPress={handleSignup}
            >
                <Text style={globalStyles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push('/home')}
                style={globalStyles.linkContainer}
            >
                <Text style={globalStyles.subtitle}>
                    Already have an account? Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}
