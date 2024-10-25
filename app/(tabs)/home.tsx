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
import { signInWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../styles/globalStyles';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
 
    if (user) {
       console.log('User logged in:', user);
    } else {
        console.log('User not logged in');
    }

    useEffect(() => {
      if (user) {
        router.replace('/UserProfil');
      }
    }, [user]);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                console.log('User logged in:', userCredential.user);
                // Redirect to UploadPayslip screen
                router.replace('/UserProfil');
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Login Error', error.message);
            });
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Welcome to PayPeek</Text>
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
            <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
                <Text style={globalStyles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push('/Signup')}
                style={globalStyles.linkContainer}
            >
                <Text style={globalStyles.subtitle}>
                    Don't have an account? Sign Up
                </Text>
            </TouchableOpacity>
        </View>
    );
}
