// import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "./components/user-nav";
import { taskSchema } from "./data/schema";
import { useState, useEffect } from "react";
import api from "@/api/axiosInstance";

type WorkflowTask = {
  key: string;
  id: string;
  title: string;
  status: string;
  label: string;
  priority: string;
};

// Simulate a database read for tasks.
// async function getTasks() {
//   // const data = await fs.readFile(path.join(process.cwd(), "app/(app)/examples/tasks/data/tasks.json"));
//   // const data =

//   // const tasks = JSON.parse(data.toString());

//   // const res = await fetch("/api/workflowtasks");
//   try {
//     const { data } = await api({
//       url: "/workflowtasks",
//       method: "get",
//     });

//     const tasks = await data.json();

//     return z.array(taskSchema).parse(tasks);
//   } catch (err) {
//     console.error("Failed fetching /workflowtasks", err);
//   }
//   // const tasks = await res.json();

//   // return z.array(taskSchema).parse(tasks);
// }

export default function WorkflowTaskPage() {
  // const tasks = await getTasks();
  // const [tasks, setTasks] = useState([]);
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);

  useEffect(() => {
    const fetchTasks = () => {
      api.get("/workflowtasks").then((res) => {
        res.data;
        // console.log(`\n\n/workflowtasks res.data: ${res.data}\n\n`);
        const tasks = z.array(taskSchema).parse(res.data);
        setTasks(tasks);
      });
    };

    fetchTasks();
  }, []);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-6 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">Here&apos;s a list of all of your WorkflowTasks!</p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
