export interface INotification {
  id: string;
  senderId: string;
  senderUsername: string;
  senderAvatar?: string;
  receiverId: string;
  type: 'invite' | 'assign'; //invite for invite to team, assign for join/ left project
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  isResponded?: boolean;
  isRead: boolean;
  content: string;
  createdAt: string;
}
