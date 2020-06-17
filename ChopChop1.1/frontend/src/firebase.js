import firebase from "firebase";

const config = {
  apiKey: "AIzaSyAXZz9JuDkM5w7PlujYZ8HhRBARJ0svUk0",
  authDomain: "chopchop-72d48.firebaseapp.com",
  databaseURL: "https://chopchop-72d48.firebaseio.com",
  projectId: "chopchop-72d48",
  storageBucket: "chopchop-72d48.appspot.com",
  messagingSenderId: "9872525671",
  appId: "1:9872525671:web:690e5d84b787a10524c7c2",
  measurementId: "G-XCZSXJCHSE",
};
// Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();

export default firebase;
