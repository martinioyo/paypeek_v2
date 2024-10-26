import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Button } from 'react-native';

// The Map component allows users to select a location on a map and confirm their selection
export default function Map({ onLocationSelect }) {
  // State to store the selected location's coordinates
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Handler for map press events
  const handleMapPress = (event) => {
    // Extract latitude and longitude from the event
    const { latitude, longitude } = event.nativeEvent.coordinate;
    // Update the state with the selected location
    setSelectedLocation({ latitude, longitude });
  };

  // Handler for the confirm button press
  const handleConfirmLocation = () => {
    // If a location is selected, call the onLocationSelect callback with the selected location
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* MapView component to display the map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // Attach the map press handler
        onPress={handleMapPress}
      >
        {/* If a location is selected, display a marker at that location */}
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>
      {/* Button to confirm the selected location */}
      <Button title="Confirm Location" onPress={handleConfirmLocation} />
    </View>
  );
}