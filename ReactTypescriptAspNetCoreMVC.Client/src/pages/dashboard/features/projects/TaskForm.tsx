import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onAdd: (title: string) => void;
};

export const TaskForm = ({ onAdd }: Props) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <Input placeholder="New task title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button type="submit">Add</Button>
    </form>
  );
};
