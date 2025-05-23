import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProjectForm } from "./ProjectForm";
import { ProjectDetails } from "./ProjectDetails";
import api from "@/api/axiosInstance";
import { Project } from "./types";
import { useAuth } from "@/auth/useAuth";

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { user: userName } = useAuth();

  useEffect(() => {
    api.get("/projects").then((res) => {
      setProjects(res.data);
      console.log(`\n\nPROJECTS: ${res.data}\n\n`);
    });
  }, []);

  // const handleCreated = (project: Project) => {
  //   setProjects((prev) => [...prev, project]);
  //   setOpenDialog(false);
  // };
  const handleCreated = async (project: Project) => {
    // ✅ Fetch the full list again (with authors)

    const res = await api.get("/projects");
    setProjects(res.data);
    setOpenDialog(false);
  };

  const handleUpdated = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setOpenDialog(false);
  };

  const handleDeleted = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedProject(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Projects</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>Add Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>test</DialogTitle>
            <ProjectForm onSubmit={handleCreated} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects.map((project: Project) => (
          <div key={project.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2
                  className="text-lg font-medium cursor-pointer"
                  onClick={() => setSelectedProject((prev) => (prev?.id === project.id ? null : project))}
                >
                  {project.title} » {project.description}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Shared with anyone with the {project.sharedWithRole} role. » Author:{" "}
                  {project.authorDisplayName || project.authorEmail || "Unknown"}
                </p>
              </div>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>test</DialogTitle>
                    <ProjectForm project={project} onSubmit={handleUpdated} />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await api.delete(`/projects/${project.id}`);
                    handleDeleted(project.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
            {selectedProject?.id === project.id && (
              <ProjectDetails project={selectedProject} onUpdate={handleUpdated} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
