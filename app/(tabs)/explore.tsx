// @ts-nocheck
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '@/config/firebase';

const ProfessionSelectionScreen = () => {
    const [professions, setProfessions] = useState([]);
    const [selectedProfession, setSelectedProfession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // Fetch professions from Firebase
    const fetchProfessions = () => {
        setIsLoading(true);
        const dbRef = ref(database, 'professions');
        onValue(
            dbRef,
            (snapshot) => {
                const data = snapshot.val();
                const professionArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setProfessions(professionArray);
                setIsLoading(false);
            },
            {
                onlyOnce: true,
            },
        );
    };

    // Handle the selection of a profession
    const handleSelectProfession = (profession) => {
        setSelectedProfession(profession);
        setIsConfirming(true);
    };

    // Confirm the selected profession
    const handleConfirmSelection = () => {
        alert(
            `You have selected: ${selectedProfession.name} with an average salary of $${selectedProfession.averageSalary}`,
        );
        setIsConfirming(false);
    };

    // Render a single profession item
    const renderProfessionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.professionItem}
            onPress={() => handleSelectProfession(item)}
        >
            <Text style={styles.professionName}>{item.name}</Text>
            <Text style={styles.professionDetails}>
                Average Salary: ${item.averageSalary}
            </Text>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelectProfession(item)}
            >
                <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={['#6DD5FA', '#FFFFFF']} style={styles.container}>
            {!isConfirming ? (
                <>
                    <Text style={styles.headerText}>Select a Profession</Text>
                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={fetchProfessions}
                    >
                        <Text style={styles.buttonText}>Select Profession</Text>
                    </TouchableOpacity>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#3498db" />
                    ) : (
                        <View style={{ flex: 1, width: '100%' }}>
                            <FlatList
                                data={professions}
                                renderItem={renderProfessionItem}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContainer}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    )}
                </>
            ) : (
                <View style={styles.confirmContainer}>
                    <Text style={styles.confirmText}>
                        Confirm your selection:
                    </Text>
                    <Text style={styles.professionName}>
                        {selectedProfession.name}
                    </Text>
                    <Text style={styles.professionDetails}>
                        Average Salary: ${selectedProfession.averageSalary}
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
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
        paddingTop: '10%',
    },
    viewButton: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    professionItem: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        width: '100%',
    },
    professionName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#34495e',
    },
    professionDetails: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 10,
    },
    selectButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    confirmText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2c3e50',
        textAlign: 'center',
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
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});

export default ProfessionSelectionScreen;