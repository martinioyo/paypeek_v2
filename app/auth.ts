import { getAuth } from 'firebase/auth';

// just for testing purposes
const auth = getAuth();
const user = auth.currentUser;

if (user) {
    console.log('User is signed in with UID:', user.uid);
} else {
    console.log('No user is signed in.');
}
