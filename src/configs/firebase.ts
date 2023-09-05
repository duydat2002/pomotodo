import {FirebaseApp, getApp, getApps, initializeApp} from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  Firestore,
  persistentLocalCache,
} from 'firebase/firestore';
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length <= 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({cacheSizeBytes: CACHE_SIZE_UNLIMITED}),
  });
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export {auth, db};
