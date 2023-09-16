import {ITask} from '@/types';
import {useAppDispatch, useAppSelector} from './useStore';
import {updateProject} from '@/store/projects.slice';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const {projects, project} = useAppSelector(state => state.projects);

  const createTask = (task: ITask) => {};

  const updateOtherForTask = (task: ITask) => {
    dispatch(
      updateProject({
        id: task.projectId,
        datas: {
          totalTask: project!.totalTask + 1,
          totalTime: project!.totalTime + task.totalPomodoro * task.longBreak,
        },
      }),
    );
  };

  return {
    createTask,
    updateOtherForTask,
  };
};
