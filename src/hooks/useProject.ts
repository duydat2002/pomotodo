import {auth, db} from '@/configs/firebase';
import {IProject} from '@/types';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export const useProject = () => {
  const addProject = async (name: string, color: string) => {
    try {
      await addDoc(collection(db, 'projects'), {
        name,
        color,
        totalTime: 0,
        elapsedTime: 0,
        totalTask: 0,
        taskComplete: 0,
        ownerId: auth.currentUser?.uid,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getProjects = async (userId: string) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'projects'),
          where('ownerId', '==', userId),
          orderBy('createdAt', 'asc'),
        ),
      );

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
