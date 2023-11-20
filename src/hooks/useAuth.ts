import {IUser} from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export const useAuth = () => {
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const userData = {
        email,
        fullname: '',
        username: '',
        avatar: '',
      };

      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set(userData);

      return {
        user: {
          id: userCredential.user.uid,
          ...userData,
        } as IUser,
        err: null,
      };
    } catch (error: any) {
      let err = {email: '', password: ''};
      switch (error.code) {
        case 'auth/invalid-email':
          err.email = 'Email is invalid - firebase auth';
          break;
        case 'auth/missing-password':
          err.password = 'Please enter your password';
          break;
        case 'auth/weak-password':
          err.password = 'Password is weak, please enter a stronger password';
          break;
        case 'auth/email-already-in-use':
          err.email = 'Email already in use';
          break;
      }
      return {
        user: null,
        err: err,
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );

      const doc = await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .get();

      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data(),
        } as IUser;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const googleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential =
        await auth().signInWithCredential(googleCredential);

      const doc = await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .get();

      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data(),
        } as IUser;
      } else {
        const userData = {
          email: userCredential.user.email,
          fullname: userCredential.user.displayName,
          username: 'user123',
          avatar: userCredential.user.photoURL,
        };

        await firestore()
          .collection('users')
          .doc(userCredential.user.uid)
          .set(userData);

        return {
          id: userCredential.user.uid,
          ...userData,
        } as IUser;
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      return null;
    }
  };

  return {
    signUp,
    signIn,
    googleSignin,
  };
};
