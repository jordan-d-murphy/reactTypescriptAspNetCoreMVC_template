// export type Project = {
//   id: number;
//   title: string;
//   description: string;
//   sharedWithRole?: string | null;
//   tasks: TaskItem[];
//   createdBy: AppUser;
//   Author: AppUser;
// };

export type Project = {
  id: number;
  title: string;
  description: string | null;
  sharedWithRole: string | null;
  authorDisplayName: string;
  authorEmail: string;
  tasks: TaskItem[];
};

export type TaskItem = {
  id: number;
  title: string;
  isComplete: boolean;
  projectId: number;
};

export type AppUser = {
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  userName: string | null;
  fullName: string | null;
  isAdmin: boolean;
};
