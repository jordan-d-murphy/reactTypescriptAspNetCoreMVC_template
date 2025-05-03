export type Project = {
  id: number;
  title: string;
  description: string;
  sharedWithRole?: string | null;
  tasks: TaskItem[];
};

export type TaskItem = {
  id: number;
  title: string;
  isComplete: boolean;
  projectId: number;
};
