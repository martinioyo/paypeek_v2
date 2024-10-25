// Import the functions needed from the SDKs
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; // Import getStorage from firebase/storage
import { getAuth } from 'firebase/auth'; // Import getAuth
import dotenv from 'dotenv';


// Load environment variables from .env file
dotenv.config();


// the web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: 'godkendopg1.firebaseapp.com',
    databaseURL:
        'https://godkendopg1-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'godkendopg1',
    storageBucket: 'godkendopg1.appspot.com',
    messagingSenderId: '62241436458',
    appId: '1:62241436458:web:9a165ec3f4b9d206956453',
    measurementId: 'G-QFK5JJM41D',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Storage and get a reference to the service
const storage = getStorage(app);

const auth = getAuth(app); // Initialize auth

// Export the initialized services
export { app, database, storage, auth };
