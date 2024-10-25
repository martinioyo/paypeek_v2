import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    Modal,
    TextInput,
    Button,
} from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { auth, storage } from '@/config/firebase';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import globalStyles from './styles/globalStyles';
import { AuthContext } from './contexts/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    
    const [description, setDescription] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

    
    // the rootNavigationState is used to check if the navigator is ready
    // before we can navigate to another screen
    // This is because the navigator is not ready immediately after the app starts
    // this can cause a error if we try to navigate before the navigator is ready
    const rootNavigationState = useRootNavigationState();
    const navigatorReady = rootNavigationState?.key != null;

    useEffect(() => {
        if (!navigatorReady) return;
    }, [navigatorReady]);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log('User signed out');
                router.replace('/home');
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Error signing out');
            });
    };

    const handleUploadPayslip = () => {
        router.replace('/(tabs)/UploadPayslip');
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
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
            setProfileImage(result.assets[0].uri);
        }
    };

    const uploadProfileImage = async () => {
        if (!profileImage) {
            Alert.alert('Please select an image first');
            return;
        }

        setUploading(true);

        try {
            const response = await fetch(profileImage);
            const blob = await response.blob();

            // Generate a unique filename

            // Since user can potentially have value of null, we need to check if user is not null with the question mark operator
            const filename = `profile_${user?.uid}_${Date.now()}.jpg`;

            const storageRef = ref(storage, `profiles/${filename}`);

            await uploadBytes(storageRef, blob);

            let downloadURL = await getDownloadURL(storageRef);

            Alert.alert('Profile picture uploaded successfully');
            console.log('Download URL:', downloadURL);

            // Here we can update the user's profile with the new image URL
            // For example, we might want to update the user's profile in the database
        } catch (error) {
            console.error(error);
            Alert.alert('Error uploading profile picture');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveDescription = () => {
        setModalVisible(false);
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Welcome, {user?.email}</Text>
            <Text style={globalStyles.bodyText}>You are logged in!</Text>

            <View style={styles.profileImageContainer}>
                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                    />
                ) : (
                    <Text style={globalStyles.bodyText}>Profile Picture</Text>
                )}
            </View>

            {description ? (
                <Text style={globalStyles.bodyText}>{description}</Text>
            ) : null}

            <TouchableOpacity
                style={globalStyles.button}
                onPress={handleUploadPayslip}
            >
                <Text style={globalStyles.buttonText}>
                    Go to Upload Payslip
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.button} onPress={pickImage}>
                <Text style={globalStyles.buttonText}>
                    Pick Profile Picture from Gallery
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={globalStyles.button}
                onPress={takePhoto}
            >
                <Text style={globalStyles.buttonText}>
                    Upload Profile Picture
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={globalStyles.button}
                onPress={() => setModalVisible(true)}
            >
                <Text style={globalStyles.buttonText}>Write Description</Text>
            </TouchableOpacity>
            {uploading && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={styles.loader}
                />
            )}
            <TouchableOpacity
                style={globalStyles.button}
                onPress={handleSignOut}
            >
                <Text style={globalStyles.buttonText}>Sign Out</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={globalStyles.modalView}>
                    <TextInput
                        style={globalStyles.input}
                        placeholder="Write a short description..."
                        value={description}
                        onChangeText={setDescription}
                    />
                    <Button title="Save" onPress={handleSaveDescription} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 20,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    loader: {
        marginTop: 20,
    },
});
