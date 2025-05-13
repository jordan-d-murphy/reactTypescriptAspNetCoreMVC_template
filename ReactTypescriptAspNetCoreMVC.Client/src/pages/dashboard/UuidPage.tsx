import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter } from "@/components/ui/card";
import { IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export default function UuidPage() {
  const [uuid, setUuid] = useState<string>("");

  useEffect(() => {
    api
      .get("/tools/uuid")
      .then((res) => res.data)
      .then(setUuid)
      .catch((err) => {
        console.error("Error fetching UUID:", err);
        setUuid("Unauthorized or error");
      });
  }, []);

  return (
    <div className="col-span-2 grid items-start text-left gap-6 lg:col-span-1 p-6 m-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">Unique GUID:</div>
            {/* <svg>
                <path></path>
              </svg> */}
          </div>
          <div className="p-6 pt-0">
            <div className="text-xl font-bold">{uuid}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
