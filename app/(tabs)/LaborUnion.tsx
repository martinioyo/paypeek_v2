// @ts-nocheck
import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ref, onValue } from 'firebase/database';
import { database } from '@/config/firebase';
import globalStyles from '../styles/globalStyles';
import { SendMessage } from '../../scripts/ai_llm';

const LaborUnionScreen = () => {
    const [laborUnions, setLaborUnions] = useState([]);
    const [selectedUnion, setSelectedUnion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isChatModalVisible, setIsChatModalVisible] = useState(false);

    // Chatbot states
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! How can I assist you regarding labor unions?',
        },
    ]);
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [isChatbotLoading, setIsChatbotLoading] = useState(false);

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

    // Handle sending a message
    const handleSendMessage = async () => {
        if (currentUserMessage.trim() === '') return;

        const newMessages = [
            ...messages,
            { role: 'user', content: currentUserMessage },
        ];
        setMessages(newMessages);
        setCurrentUserMessage('');
        setIsChatbotLoading(true);

        try {
            const aiResponse = await SendMessage(newMessages);
            setMessages([...newMessages, aiResponse]);
        } catch (error) {
            // console.error('Error in handleSendMessage:', error);
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content:
                        'Labor unions improve wages, benefits, and job security for workers, reduce income inequality, and promote broader economic and social improvements through collective bargaining and advocacy.',
                },
            ]);
        } finally {
            setIsChatbotLoading(false);
        }
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
                <Text style={globalStyles.buttonText}>Select</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#6DD5FA', '#FFFFFF']}
            style={globalStyles.container}
        >
            {!isConfirming ? (
                <>
                    <Text style={globalStyles.title}>Labor Unions</Text>
                    <Text style={globalStyles.subtitle}>
                        Explore and choose the best union for you
                    </Text>
                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={fetchLaborUnions}
                    >
                        <Text style={globalStyles.buttonText}>View Unions</Text>
                    </TouchableOpacity>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#3498db" />
                    ) : (
                        <FlatList
                            data={laborUnions}
                            renderItem={renderUnionItem}
                            keyExtractor={(item) => item.id}
                            style={styles.list}
                        />
                    )}

                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={() => setIsChatModalVisible(true)}
                    >
                        <Text style={globalStyles.buttonText}>Chat with AI</Text>
                    </TouchableOpacity>

                    <Modal
                        visible={isChatModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setIsChatModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={globalStyles.subtitle}>
                                    Ask our AI assistant about labor unions
                                </Text>

                                <KeyboardAvoidingView
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={{ flex: 1 }}
                                >
                                    <ScrollView
                                        contentContainerStyle={styles.chatContainer}
                                        keyboardShouldPersistTaps="handled"
                                    >
                                        {messages.map((msg, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.messageBubble,
                                                    msg.role === 'user'
                                                        ? styles.userMessage
                                                        : styles.assistantMessage,
                                                ]}
                                            >
                                                <Text style={styles.messageText}>
                                                    {msg.content}
                                                </Text>
                                            </View>
                                        ))}
                                        {isChatbotLoading && (
                                            <ActivityIndicator
                                                size="small"
                                                color="#3498db"
                                            />
                                        )}
                                    </ScrollView>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Type your message..."
                                            value={currentUserMessage}
                                            onChangeText={setCurrentUserMessage}
                                            onSubmitEditing={handleSendMessage}
                                        />
                                        <TouchableOpacity
                                            style={styles.sendButton}
                                            onPress={handleSendMessage}
                                        >
                                            <Text style={styles.sendButtonText}>Send</Text>
                                        </TouchableOpacity>
                                    </View>
                                </KeyboardAvoidingView>

                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setIsChatModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                <View style={globalStyles.confirmContainer}>
                    <Text style={globalStyles.confirmText}>
                        Confirm your selection:
                    </Text>
                    <Text style={globalStyles.bodyText}>
                        {selectedUnion.name}
                    </Text>
                    <Text style={globalStyles.bodyText}>
                        Membership Fee: {selectedUnion.fee}
                    </Text>
                    <Text style={globalStyles.bodyText}>
                        Benefits: {selectedUnion.benefits.join(', ')}
                    </Text>
                    <Text style={globalStyles.bodyText}>
                        Industry Focus: {selectedUnion.industry}
                    </Text>
                    <View style={styles.confirmButtonsContainer}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirmSelection}
                        >
                            <Text style={globalStyles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
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

const styles = StyleSheet.create({
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
    list: {
        maxHeight: 250,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 20,
    },
    chatContainer: {
        flexGrow: 1,
        paddingBottom: 10,
    },
    messageBubble: {
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#3498db',
    },
    assistantMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ecf0f1',
    },
    messageText: {
        color: '#2c3e50',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: '#ecf0f1',
        borderRadius: 20,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#3498db',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
    modalContainer: {
        flex: 1,
        marginTop: '20%',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: '50%',
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    closeButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default LaborUnionScreen;