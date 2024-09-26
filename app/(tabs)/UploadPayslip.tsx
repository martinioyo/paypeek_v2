import React, { useState } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Buffer } from 'buffer';

export default function UploadPayslip() {
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        } else {
            Alert.alert('No image selected.');
        }
    };

    const takePhoto = async () => {
        const permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image) {
            Alert.alert('Please select an image first');
            return;
        }

        setUploading(true);

        try {
            const response = await fetch(image);
            const blob = await response.blob();

            // Generate a unique filename
            const filename = `payslip_${Date.now()}.jpg`;

            const storageRef = ref(storage, `payslips/${filename}`);

            await uploadBytes(storageRef, blob);

            let downloadURL = await getDownloadURL(storageRef);

            Alert.alert('Image uploaded successfully');
            console.log('Download URL:', downloadURL);

            // **Base64-encode the downloadURL**
            const encodedURL = Buffer.from(downloadURL).toString('base64');

            // Navigate to Salary Summary screen using router.push
            router.push({
                pathname: '/SalarySummary',
                params: { imageUrl: encodedURL },
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#A1CEDC', '#FFFFFF']}
            style={styles.container}
        >
            <Text style={styles.title}>Upload Your Payslip</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Pick an Image from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Text style={styles.buttonText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={uploadImage}>
                    <Text style={styles.buttonText}>Submit Payslip</Text>
                </TouchableOpacity>
            </View>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            {uploading && (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        marginBottom: 20,
        fontWeight: '600',
        color: '#2c3e50',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    image: {
        width: 250,
        height: 250,
        marginVertical: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    loader: {
        marginTop: 20,
    },
});
