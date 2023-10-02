export interface IProject {
  id: string;
  name: string;
  color: string;
  totalTime: number;
  elapsedTime: number;
  totalTask: number;
  taskComplete: number;
  ownerId: string; //Project owner ID
  team: string[];
  createdAt: string;
}
