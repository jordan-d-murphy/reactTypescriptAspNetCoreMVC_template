import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
          <div className="rounded-md bg-black p-6 rounded-md bg-black p-6 max-h-[500px] overflow-auto">
            <pre>
              <code className="grid gap-1 text-sm text-muted-foreground [&_span]:h-4 text-sm text-muted-foreground whitespace-pre-wrap">
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
