export interface TaskInterface {
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  columnId: string;
  boardId: string;
};
