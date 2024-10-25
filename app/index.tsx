import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { useRouter } from 'expo-router';

import globalStyles from './styles/globalStyles';

// create landing page
const LandingPage = () => {
    const router = useRouter();
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Welcome to PayPeek</Text>

            <TouchableOpacity 
                onPress={() => router.replace('/home')} 
                style={{ alignItems: 'center', justifyContent: 'center' }}
            >
                <Text style={globalStyles.title}>Press here to start</Text>
                
                <Image
                    source={require('../assets/images/paypeek_landing.png')}
                    style={{
                        width: 300,
                        height: 300,
                        marginTop: 20,
                    }}
                />
            </TouchableOpacity>
        </View>
    );
};

export default LandingPage;
