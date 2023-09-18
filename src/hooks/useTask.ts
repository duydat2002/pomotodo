import {ITask} from '@/types';
import {useAppDispatch, useAppSelector} from './useStore';
import {setTasks} from '@/store/tasks.slice';
import {useProject} from '@/hooks/useProject';

export const useTask = () => {
  const dispatch = useAppDispatch();
  const {tasks} = useAppSelector(state => state.tasks);
  const {updateProjectInfo} = useProject();

  const createTask = (task: ITask) => {
    let updatedTasks: ITask[];

    if (tasks) {
      const check = tasks.findIndex(item => item.id == task.id);

      updatedTasks = check == -1 ? [...tasks, task] : tasks;
    } else {
      updatedTasks = [task];
    }

    dispatch(setTasks(updatedTasks));
    updateProjectInfo(task.projectId, updatedTasks);
  };

  const updateTask = (task: ITask) => {
    if (tasks) {
      const updatedTasks: ITask[] = tasks.map(item => {
        return item.id == task.id ? task : item;
      });

      dispatch(setTasks(updatedTasks));
      updateProjectInfo(task.projectId, updatedTasks);
    }
  };

  return {
    createTask,
    updateTask,
  };
};
