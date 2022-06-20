import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD5PgM0zPmdQXNWLKZ0gfcnxybfWIWyMYc",
    authDomain: "image-gallery-react-c4af8.firebaseapp.com",
    projectId: "image-gallery-react-c4af8",
    storageBucket: "image-gallery-react-c4af8.appspot.com",
    messagingSenderId: "213685982640",
    appId: "1:213685982640:web:db2ed1f57aa4975e913275",
    measurementId: "G-3GXEQZFFXH"  
});

export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();