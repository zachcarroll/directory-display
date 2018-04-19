import * as firebase from 'firebase';

const prodConfig = {
  apiKey: "AIzaSyDpkGBOwpeq5KMfRIgT25EhQujjBV5G2J0",
  authDomain: "directory-display.firebaseapp.com",
  databaseURL: "https://directory-display.firebaseio.com",
  projectId: "directory-display",
  storageBucket: "",
  messagingSenderId: "395991257701"
};

const devConfig = {
    apiKey: "AIzaSyALEj8Jqw3f8AkMLsHnJKMSeKsV1ufvjsk",
    authDomain: "dev-directory-display.firebaseapp.com",
    databaseURL: "https://dev-directory-display.firebaseio.com",
    projectId: "dev-directory-display",
    storageBucket: "dev-directory-display.appspot.com",
    messagingSenderId: "596404179828"
  };

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const storage = firebase.storage();
const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
  storage,
};
