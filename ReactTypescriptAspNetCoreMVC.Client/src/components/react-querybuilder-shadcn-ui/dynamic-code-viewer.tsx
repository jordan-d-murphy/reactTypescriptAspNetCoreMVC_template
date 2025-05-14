import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ShieldAlert, ShieldCheck, Files } from "lucide-react";
import { toast } from "react-toastify";

export enum DynamicCodeViewerType {
  save_export = "Save / Export",
  from_config = "Load From Config",
}

export function DynamicCodeViewer({ type, query }: { type: DynamicCodeViewerType; query: string }) {
  let template = {
    type,
    desc: "Here is the config you've saved. Ready for export: ",
    query,
  };

  if (type === DynamicCodeViewerType.from_config) {
    template.type = DynamicCodeViewerType.from_config;
    template.desc = "Here's the config you've loaded. Ready to view: ";
    template.query = query;
  }

  const configJson = JSON.stringify(query, null, 2);
  console.log(configJson);

  function handleCopy() {
    navigator.clipboard.writeText(query);
    toast.info("Copied to clipboard.");
  }

  function handleFix() {
    toast.warn("Config could not be validated.");
  }

  function handleValid() {
    toast.success("Config is valid.");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">{template.type}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{template.type}</DialogTitle>
          <DialogDescription>{template.desc}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {/* <div className="rounded-md bg-black p-6 rounded-md bg-black p-6 max-h-[500px] overflow-auto"> */}
          <div className="rounded-md p-6 rounded-md p-6 max-h-[500px] overflow-auto">
            {/* {type && type === DynamicCodeViewerType.from_config ? (
              <button
                className="absolute bottom-5 right-5 text-muted-foreground hover:text-white"
                onClick={() => navigator.clipboard.writeText(query)}
                title="Copy to clipboard"
              >
                <ShieldCheck className="text-red-500" />
              </button>
            ) : (
              <button
                className="absolute bottom-5 right-5 text-muted-foreground hover:text-white"
                onClick={() => navigator.clipboard.writeText(query)}
                title="Fix it"
              >
                <ShieldCheck className="text-green-500" />
              </button>
            )} */}

            <pre>
              {/* <code className="grid gap-1 text-sm text-muted-foreground [&_span]:h-4 text-sm text-muted-foreground whitespace-pre-wrap"> */}
              <code className="grid gap-1 text-sm text-muted-foreground whitespace-pre-wrap [&_span]:h-4">
                {type && type === DynamicCodeViewerType.from_config ? (
                  <>
                    <button
                      className="absolute top-25 right-10 text-muted-foreground hover:text-white"
                      onClick={handleFix}
                      title="Config could not be validated!"
                    >
                      <ShieldAlert className="text-red-500" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="absolute top-25 right-10 text-muted-foreground hover:text-white"
                      onClick={handleValid}
                      title="Config is valid."
                    >
                      <ShieldCheck className="text-green-500" />
                    </button>
                  </>
                )}
                <button
                  className="absolute bottom-25 right-10 text-muted-foreground hover:text-white"
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  <Files className="text-gray-500" />
                </button>

                {query}
              </code>
            </pre>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Your {template.type} API Key can be found here. You should use environment variables or a secret
              management tool to expose your key to your applications.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
