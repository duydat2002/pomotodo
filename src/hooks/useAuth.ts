import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  or,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {auth, db} from '@/configs/firebase';
import {IAuth, IUser} from '@/types';

export const useAuth = () => {
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const userData = {
        email,
        fullname: '',
        username: '',
        avatar: '',
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      return {
        user: {
          id: userCredential.user.uid,
          ...userData,
        } as IUser,
        err: null,
      };
    } catch (error: any) {
      let err: IAuth = {email: '', password: ''};
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

  const signIn = async (
    email: string,
    password: string,
  ): Promise<IUser | null> => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'users'), where('email', '==', email)),
      );

      if (querySnapshot.empty) {
        return null;
      } else {
        let userTemp: IUser | null = null;

        querySnapshot.forEach(doc => {
          userTemp = {
            id: doc.id,
            ...doc.data(),
          } as IUser;
        });

        await signInWithEmailAndPassword(auth, email, password);

        return userTemp;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {
    signUp,
    signIn,
  };
};
