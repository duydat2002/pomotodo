import {FirebaseApp, getApp, getApps, initializeApp} from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAwvC4PzlJrJNJFdznkVGNnx-1SGBb7r3E',
  authDomain: 'pomotodo-99f23.firebaseapp.com',
  projectId: 'pomotodo-99f23',
  storageBucket: 'pomotodo-99f23.appspot.com',
  messagingSenderId: '374578291201',
  appId: '1:374578291201:web:e41bf53532cd49050a9600',
  measurementId: 'G-ZTQT4Y9W3E',
};

let app: FirebaseApp, auth: Auth;

if (getApps().length <= 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore(app);

export {auth, db};
