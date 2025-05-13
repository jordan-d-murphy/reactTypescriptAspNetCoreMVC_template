import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function RandomNumberPage() {
  const [number, setNumber] = useState<number | string>("");

  useEffect(() => {
    api
      .get("/tools/random")
      .then((res) => {
        return res.data;
      })
      .then(setNumber)
      .catch((err) => {
        console.error("Error fetching Timestamp:", err);
        setNumber("Unauthorized or error");
      });
  }, []);

  return (
    <div className="col-span-2 grid items-start text-left gap-6 lg:col-span-1 p-6 m-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">Random Number:</div>
            {/* <svg>
                <path></path>
              </svg> */}
          </div>
          <div className="p-6 pt-0">
            <div className="text-xl font-bold">{number}</div>
            <p className="text-xs text-muted-foreground">@seeded</p>
          </div>
        </div>
      </div>
    </div>
  );
}
