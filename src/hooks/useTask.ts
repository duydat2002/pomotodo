import {ITask} from '@/types';
import {useAppDispatch, useAppSelector} from './useStore';
import {setTasks} from '@/store/tasks.slice';
import {useProject} from '@/hooks/useProject';

export const useTask = () => {
  const dispatch = useAppDispatch();
  const {projects, project} = useAppSelector(state => state.projects);
  const {tasks} = useAppSelector(state => state.tasks);
  const {updateProjectInfo} = useProject();

  const createTask = (task: ITask) => {
    const newTasks = tasks ? [...tasks, task] : [task];

    dispatch(setTasks(newTasks));

    updateProjectInfo(task.projectId, newTasks);
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
