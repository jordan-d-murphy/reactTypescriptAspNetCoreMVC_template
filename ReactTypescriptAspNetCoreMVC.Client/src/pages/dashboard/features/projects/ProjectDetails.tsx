import { useState } from "react";
import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import api from "@/api/axiosInstance";
import { Project, TaskItem } from "./types";

type Props = {
  project: Project;
  onUpdate: (project: Project) => void;
};

export const ProjectDetails = ({ project, onUpdate }: Props) => {
  const [tasks, setTasks] = useState<TaskItem[]>(project.tasks || []);

  const handleAddTask = async (title: string) => {
    const res = await api.post(`/projects/${project.id}/tasks`, {
      title,
      isComplete: false,
    });
    setTasks((prev) => [...prev, res.data]);
  };

  const handleToggle = async (task: TaskItem) => {
    const updated = { ...task, isComplete: !task.isComplete };
    await api.put(`/projects/${project.id}/tasks/${task.id}`, updated);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/projects/${project.id}/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="mt-4 bg-muted p-4 rounded-md">
      <h3 className="font-semibold text-lg">Details</h3>
      <p>
        <strong>Description:</strong> {project.description || "(none)"}
      </p>
      {project.sharedWithRole && (
        <p>
          <strong>Shared With:</strong> {project.sharedWithRole}
        </p>
      )}

      <div className="mt-4">
        <h4 className="font-medium">Tasks</h4>
        <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        <TaskForm onAdd={handleAddTask} />
      </div>
    </div>
  );
};
