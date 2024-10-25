// @ts-nocheck
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '@/config/firebase';
import globalStyles from '../styles/globalStyles';
import Slider from '@react-native-community/slider';

import Map from '../../scripts/map';

const ProfessionSelectionScreen = () => {
    const [professions, setProfessions] = useState([]);
    const [selectedProfession, setSelectedProfession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [mapOpen, setMapOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [sliderOpen, setSliderOpen] = useState(false); // New state for slider visibility
    const [sliderValue, setSliderValue] = useState(0); // New state for slider value

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
            style={globalStyles.professionItem}
            onPress={() => handleSelectProfession(item)}
        >
            <Text style={globalStyles.professionName}>{item.name}</Text>
            <Text style={globalStyles.professionDetails}>
                Average Salary: ${item.averageSalary}
            </Text>
            <TouchableOpacity
                style={globalStyles.selectButton}
                onPress={() => handleSelectProfession(item)}
            >
                <Text style={globalStyles.buttonText}>Select</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setMapOpen(false);
    };

    return (
        <LinearGradient
            colors={['#6DD5FA', '#FFFFFF']}
            style={globalStyles.container}
        >
            {!isConfirming ? (
                <>
                    <Text style={globalStyles.title}>
                        Select your Profession
                    </Text>
                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={fetchProfessions}
                    >
                        <Text style={globalStyles.buttonText}>
                            Select Profession
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={() => setSliderOpen(!sliderOpen)}
                    >
                        <Text style={globalStyles.buttonText}>
                            Choose Salary Range
                        </Text>
                    </TouchableOpacity>

                    {sliderOpen && (
                        <View style={{ alignItems: 'center' }}>
                            <Slider
                                style={{ width: 200, height: 40 }}
                                minimumValue={0}
                                maximumValue={100000}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                onValueChange={setSliderValue}
                            />
                            <Text>
                                Selected Salary: ${sliderValue.toFixed(0)}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={() => setMapOpen(true)}
                    >
                        <Text style={globalStyles.buttonText}>
                            Choose Location from map
                        </Text>
                    </TouchableOpacity>

                    {mapOpen && <Map onLocationSelect={handleLocationSelect} />}

                    {selectedLocation && (
                        <Text style={globalStyles.locationText}>
                            Selected Location: {selectedLocation.latitude},{' '}
                            {selectedLocation.longitude}
                        </Text>
                    )}

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#3498db" />
                    ) : (
                        <View style={{ flex: 1, width: '100%' }}>
                            <FlatList
                                data={professions}
                                renderItem={renderProfessionItem}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={
                                    globalStyles.listContainer
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    )}
                </>
            ) : (
                <View style={globalStyles.confirmContainer}>
                    <Text style={globalStyles.confirmText}>
                        Confirm your selection:
                    </Text>
                    <Text style={globalStyles.professionName}>
                        {selectedProfession?.name}
                    </Text>
                    <Text style={globalStyles.professionDetails}>
                        Average Salary: ${selectedProfession?.averageSalary}
                    </Text>
                    <View style={globalStyles.confirmButtonsContainer}>
                        <TouchableOpacity
                            style={globalStyles.confirmButton}
                            onPress={handleConfirmSelection}
                        >
                            <Text style={globalStyles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={globalStyles.cancelButton}
                            onPress={() => setIsConfirming(false)}
                        >
                            <Text style={globalStyles.buttonText}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </LinearGradient>
    );
};

export default ProfessionSelectionScreen;
