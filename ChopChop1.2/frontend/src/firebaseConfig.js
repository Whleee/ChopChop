import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore';
import Axios from 'axios'

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPKvgOhMorW7BVV6O9Z597wYb7L7p9Tcw",
  authDomain: "chopchop-277909.firebaseapp.com",
  databaseURL: "https://chopchop-277909.firebaseio.com",
  projectId: "chopchop-277909",
  storageBucket: "chopchop-277909.appspot.com",
  messagingSenderId: "636244796278",
  appId: "1:636244796278:web:4e27f508b8e16856181057",
  measurementId: "G-7KCR9NLJ9L"
};

firebase.initializeApp(config)

const db = firebase.firestore()

export { Axios, db }