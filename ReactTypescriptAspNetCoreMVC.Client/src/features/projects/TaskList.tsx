import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type TaskItem = {
  id: number;
  title: string;
  isComplete: boolean;
  projectId: number;
};

type Props = {
  tasks: TaskItem[];
  onToggle: (task: TaskItem) => void;
  onDelete: (id: number) => void;
};

export const TaskList = ({ tasks, onToggle, onDelete }: Props) => {
  if (tasks.length === 0) return <p className="text-muted-foreground">No tasks yet.</p>;

  return (
    <ul className="space-y-2 mt-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between bg-white p-2 rounded border">
          <div className="flex items-center gap-2">
            <Checkbox checked={task.isComplete} onCheckedChange={() => onToggle(task)} />
            <span className={task.isComplete ? "line-through text-muted-foreground" : ""}>{task.title}</span>
          </div>
          <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
};
