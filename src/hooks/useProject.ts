import {IProject} from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from './useStore';
import {getData} from '@/hooks';

export const useProject = () => {
  const addProject = async (name: string, color: string) => {
    try {
      firestore()
        .collection('projects')
        .add({
          name,
          color,
          totalTime: 0,
          elapsedTime: 0,
          totalTask: 0,
          taskComplete: 0,
          ownerId: auth().currentUser!.uid,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getProjects = async (userId: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('projects')
        .where('ownerId', '==', userId)
        .orderBy('createdAt', 'asc')
        .get();

      if (querySnapshot.empty) {
        return null;
      } else {
        const comments: IProject[] = [];
        querySnapshot.forEach(doc => {
          comments.push({
            id: doc.id,
            ...doc.data(),
          } as IProject);
        });
        return comments;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {addProject, getProjects};
};
