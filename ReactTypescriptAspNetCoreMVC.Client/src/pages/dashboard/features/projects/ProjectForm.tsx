import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/api/axiosInstance";
import { Project } from "./types";

interface ProjectFormValues {
  title: string;
  description?: string;
  sharedWithRole?: string;
}

type Props = {
  project?: Project;
  onSubmit: (project: Project) => void;
};

export const ProjectForm = ({ project, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      sharedWithRole: project?.sharedWithRole || "",
    },
  });

  const submit = async (data: ProjectFormValues) => {
    try {
      let response;
      if (project) {
        response = await api.put(`/projects/${project.id}`, { ...project, ...data });
        onSubmit({ ...project, ...data });
      } else {
        response = await api.post(`/projects`, data);
        onSubmit(response.data);
      }
    } catch (err) {
      console.error("Project submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: true })} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div>
        <Label htmlFor="sharedWithRole">Shared With Role</Label>
        <Input id="sharedWithRole" placeholder="Admin, Premium, etc." {...register("sharedWithRole")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {project ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
};
