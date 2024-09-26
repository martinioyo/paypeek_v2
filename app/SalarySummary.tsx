import React from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Buffer } from 'buffer'; // Import Buffer

export default function SalarySummary() {
    const { imageUrl: encodedImageUrl } = useLocalSearchParams<{ imageUrl: string }>();

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
            colors={['#e6f0f5', '#FFFFFF']}
            style={styles.container}
        >
            <Text style={styles.title}>Salary Summary</Text>
            {imageUrl && (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            )}
            <View style={styles.table}>
                {Object.entries(salaryData).map(([key, value]) => (
                    <View key={key} style={styles.tableRow}>
                        <Text style={styles.tableKey}>{key}</Text>
                        <Text style={styles.tableValue}>{value}</Text>
                    </View>
                ))}
            </View>
            <Button
                title="Proceed"
                onPress={() => {
                    // Handle proceed action
                    Alert.alert('Proceeding to the next step...');
                }}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginVertical: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    image: {
        width: 250,
        height: 250,
        marginVertical: 16,
        borderRadius: 8,
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
    tableValue: {
        fontSize: 16,
        color: '#555',
    },
});
