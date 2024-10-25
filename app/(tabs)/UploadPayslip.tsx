import React, { useState } from 'react';
import {
    Text,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    View,
    Modal,
    FlatList,
    StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Buffer } from 'buffer';
import globalStyles from '../styles/globalStyles';

export default function UploadPayslip() {
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const [blockchainModalVisible, setBlockchainModalVisible] = useState(false);
    const [selectedBlockchain, setSelectedBlockchain] = useState<string | null>(null);
    const [fakeHash, setFakeHash] = useState<string | null>(null);

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

    const generateFakeHash = (blob: Blob): string => {
        // For illustration, generate a random hex string
        const chars = 'abcdef0123456789';
        let hash = '';
        for (let i = 0; i < 64; i++) {
            // this generates a random number
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    };

    const uploadFakeHash = async (blockchain: string) => {
        if (!image) {
            Alert.alert('Please select an image first');
            return;
        }

        setUploading(true);

        try {
            const response = await fetch(image);
            const blob = await response.blob();

            // Generate a fake hash code
            const hashCode = generateFakeHash(blob);

            setFakeHash(hashCode);

            Alert.alert('Document hash uploaded to ' + blockchain);

            // Navigate to Salary Summary screen using router.push
            router.push({
                pathname: '/SalarySummary',
                params: { fakeHash: hashCode, blockchain },
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error uploading document hash');
        } finally {
            setUploading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#6DD5FA', '#FFFFFF']}
            style={globalStyles.container}
        >
            <Text style={globalStyles.title}>Upload Your Payslip</Text>
            <View >
                <TouchableOpacity style={globalStyles.button} onPress={pickImage}>
                    <Text style={globalStyles.buttonText}>Pick an Image from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.button} onPress={takePhoto}>
                    <Text style={globalStyles.buttonText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.button} onPress={uploadImage}>
                    <Text style={globalStyles.buttonText}>Submit Payslip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={globalStyles.button} onPress={() => setBlockchainModalVisible(true)}>
                    <Text style={globalStyles.buttonText}>Choose Blockchain</Text>
                </TouchableOpacity>
            </View>
            {image && <Image source={{ uri: image }} style={globalStyles.uploadImage} />}
            {uploading && (
                <ActivityIndicator size="large" color="#0000ff" style={globalStyles.uploadLoader} />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={blockchainModalVisible}
                onRequestClose={() => {
                    setBlockchainModalVisible(!blockchainModalVisible);
                }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalView}>
                        <Text style={globalStyles.title}>Select a Blockchain</Text>
                        <FlatList
                            data={['Ethereum', 'Bitcoin', 'Polygon', 'Binance Smart Chain']}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.blockchainButton}
                                    onPress={() => {
                                        setSelectedBlockchain(item);
                                        setBlockchainModalVisible(false);
                                        uploadFakeHash(item);
                                    }}
                                >
                                    <Text style={styles.blockchainButtonText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setBlockchainModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
    },
    blockchainButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 8,
        alignItems: 'center',
        width: '100%',
    },
    blockchainButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalCancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
