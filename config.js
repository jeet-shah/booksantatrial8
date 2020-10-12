import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyCwwz_Cv1VaFChSzmGCfeatypcXiat9nBw",
  authDomain: "book-santa-123.firebaseapp.com",
  databaseURL: "https://book-santa-123.firebaseio.com",
  projectId: "book-santa-123",
  storageBucket: "book-santa-123.appspot.com",
  messagingSenderId: "311876208430",
  appId: "1:311876208430:web:0f0a083a188d640de8dcbf"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
