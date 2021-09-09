import * as firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCB7cILNrc15QrwrSfHAQz9_AL1uZYBeDw",
  authDomain: "medical-ecom-72c30.firebaseapp.com",
  projectId: "medical-ecom-72c30",
  storageBucket: "medical-ecom-72c30.appspot.com",
  messagingSenderId: "658730150454",
  appId: "1:658730150454:web:56fc511a1fba36877fc697",
  measurementId: "G-WPXBLYCEKF",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCB7cILNrc15QrwrSfHAQz9_AL1uZYBeDw",
//   authDomain: "medical-ecom-72c30.firebaseapp.com",
//   projectId: "medical-ecom-72c30",
//   storageBucket: "medical-ecom-72c30.appspot.com",
//   messagingSenderId: "658730150454",
//   appId: "1:658730150454:web:56fc511a1fba36877fc697",
//   measurementId: "G-WPXBLYCEKF",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

export default {firebaseConfig};
