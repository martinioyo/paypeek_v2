import React, { useState } from 'react';
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

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
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
        <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.replace('/')}
                style={styles.linkContainer}
            >
                <Text style={styles.linkText}>
                    Already have an account? Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    // Styles are similar to LoginScreen
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#A1CEDC',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        marginBottom: 40,
        alignSelf: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#1D3D47',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    linkContainer: {
        alignItems: 'center',
    },
    linkText: {
        color: '#fff',
        textDecorationLine: 'underline',
    },
});
