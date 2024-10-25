import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Buffer } from 'buffer'; // Import Buffer
import globalStyles from './styles/globalStyles';

export default function SalarySummary() {
    const router = useRouter();
    const { imageUrl: encodedImageUrl, fakeHash, blockchain } = useLocalSearchParams<{
        imageUrl: string;
        fakeHash: string;
        blockchain: string;
    }>();

    // **Decode the imageUrl from base64**
    const imageUrl = encodedImageUrl
        ? Buffer.from(encodedImageUrl, 'base64').toString('utf8')
        : null;

    console.log('Decoded imageUrl:', imageUrl);

    // Fake salary data
    const salaryData = {
        'Gross Salary': '$5,000',
        Taxes: '$1,000',
        'Net Salary': '$4,000',
        Deductions: '$500',
    };

    return (
        <LinearGradient
            colors={['#6DD5FA', '#FFFFFF']}
            style={globalStyles.container}
        >
            <Text style={globalStyles.title}>Salary Summary</Text>
            {imageUrl && (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            )}
            {fakeHash && (
                <View style={styles.hashContainer}>
                    <Text style={styles.hashTitle}>Blockchain: {blockchain}</Text>
                    <Text style={styles.hashText}>Document Hash:</Text>
                    <Text style={styles.hashValue}>{fakeHash}</Text>
                </View>
            )}
            <View style={styles.table}>
                {Object.entries(salaryData).map(([key, value]) => (
                    <View key={key} style={styles.tableRow}>
                        <Text style={styles.tableKey}>{key}</Text>
                        <Text style={globalStyles.bodyText}>{value}</Text>
                    </View>
                ))}
            </View>
            <Button
                title="Proceed"
                onPress={() => {
                    // Handle proceed action
                    Alert.alert('Proceeding to the next step...');
                    router.replace('/home');
                }}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 250,
        height: 250,
        marginVertical: 16,
        borderRadius: 8,
        alignSelf: 'center',
    },
    table: {
        width: '90%',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        elevation: 3,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    tableKey: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    hashContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginVertical: 16,
        alignItems: 'center',
    },
    hashTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    hashText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    hashValue: {
        fontSize: 14,
        color: '#34495e',
        marginTop: 8,
        textAlign: 'center',
    },
});
