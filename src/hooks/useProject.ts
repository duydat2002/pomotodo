import {IProject, ITask} from '@/types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from './useStore';
import {updateProject} from '@/store/projects.slice';

export const useProject = () => {
  const dispatch = useAppDispatch();

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

  const updateProjectInfo = (projectId: string, tasks: ITask[]) => {
    let totalTime = 0,
      elapsedTime = 0,
      totalTask = 0,
      taskComplete = 0;

    tasks.forEach(task => {
      if (task.projectId == projectId) {
        totalTime += task.totalPomodoro * task.longBreak;
        totalTask++;
        elapsedTime += task.pomodoroCount * task.longBreak;
        if (task.isDone) taskComplete++;
      }
    });

    dispatch(
      updateProject({
        id: projectId,
        datas: {
          totalTime,
          elapsedTime,
          totalTask,
          taskComplete,
        },
      }),
    );
  };

  return {addProject, getProjects, updateProjectInfo};
};
