// @ts-nocheck
import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Added for gradient background
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '@/config/firebase';

const LaborUnionScreen = () => {
    const [laborUnions, setLaborUnions] = useState([]);
    const [selectedUnion, setSelectedUnion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // Fetch labor unions from Firebase
    const fetchLaborUnions = () => {
        setIsLoading(true);
        const dbRef = ref(database, 'laborUnions');
        onValue(
            dbRef,
            (snapshot) => {
                const data = snapshot.val();
                const unionArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setLaborUnions(unionArray);
                setIsLoading(false);
            },
            {
                onlyOnce: true,
            },
        );
    };

    // Handle the selection of a labor union
    const handleSelectUnion = (union) => {
        setSelectedUnion(union);
        setIsConfirming(true);
    };

    // Confirm the selected union
    const handleConfirmSelection = () => {
        alert(`You have selected: ${selectedUnion.name}`);
        setIsConfirming(false);
    };

    // Render a single labor union item
    const renderUnionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.unionItem}
            onPress={() => handleSelectUnion(item)}
        >
            <Text style={styles.unionName}>{item.name}</Text>
            <Text>Membership Fee: {item.fee}</Text>
            <Text>Benefits: {item.benefits.join(', ')}</Text>
            <Text>Industry Focus: {item.industry}</Text>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelectUnion(item)}
            >
                <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#A1CEDC', '#FFFFFF']} // Soft gradient for background
            style={styles.container}
        >
            {!isConfirming ? (
                <>
                    <Text style={styles.headerText}>Labor Unions</Text>
                    <Text style={styles.subHeaderText}>
                        Explore and choose the best union for you
                    </Text>
                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={fetchLaborUnions}
                    >
                        <Text style={styles.buttonText}>View Unions</Text>
                    </TouchableOpacity>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#3498db" />
                    ) : (
                        <FlatList
                            data={laborUnions}
                            renderItem={renderUnionItem}
                            keyExtractor={(item) => item.id}
                        />
                    )}
                </>
            ) : (
                <View style={styles.confirmContainer}>
                    <Text style={styles.confirmText}>
                        Confirm your selection:
                    </Text>
                    <Text style={styles.selectedUnionName}>
                        {selectedUnion.name}
                    </Text>
                    <Text style={styles.detailsText}>
                        Membership Fee: {selectedUnion.fee}
                    </Text>
                    <Text style={styles.detailsText}>
                        Benefits: {selectedUnion.benefits.join(', ')}
                    </Text>
                    <Text style={styles.detailsText}>
                        Industry Focus: {selectedUnion.industry}
                    </Text>
                    <View style={styles.confirmButtonsContainer}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirmSelection}
                        >
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setIsConfirming(false)}
                        >
                            <Text style={styles.buttonText}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '40%',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 20,
    },
    unionItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    unionName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    selectButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    viewButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    confirmContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    confirmText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
        textAlign: 'center',
    },
    selectedUnionName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#2c3e50',
        textAlign: 'center',
    },
    detailsText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 5,
    },
    confirmButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    confirmButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
});

export default LaborUnionScreen;
