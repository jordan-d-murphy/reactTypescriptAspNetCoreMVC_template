"use client";

import * as React from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";

// import { toast } from "@/components/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// import { Toaster } from "@/components/ui/sonner";
import { toast } from "react-toastify";
import { useEffect } from "react";

export function PresetActions() {
  const [open, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const [shouldRenderDialog, setShouldRenderDialog] = React.useState(false);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => setShouldRenderDialog(true), 10);
      return () => clearTimeout(id);
    } else {
      setShouldRenderDialog(false);
    }
  }, [open]);

  return (
    <>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <span className="sr-only">Actions</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // Prevent the menu from closing too soon
              setTimeout(() => setIsOpen(true), 10);
              // setIsOpen(true);
              // requestAnimationFrame(() => setIsOpen(true));
            }}
          >
            Content filter preferences
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // Prevent the menu from closing too soon
              setTimeout(() => setIsOpen(true), 10);
              // setIsOpen(true);
              // requestAnimationFrame(() => setIsOpen(true));
            }}
            className="text-red-600"
          >
            Delete preset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}

      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        Content filter preferences
      </Button>

      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Content filter preferences</DialogTitle>
            <DialogDescription>
              The content filter flags text that may violate our content policy. It&apos;s powered by our moderation
              endpoint which is free to use to moderate your OpenAI API traffic. Learn more.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <h4 className="text-sm text-muted-foreground">Playground Warnings</h4>
            <div className="flex items-start justify-between space-x-4 pt-3">
              <Switch name="show" id="show" defaultChecked={true} />
              <Label className="grid gap-1 font-normal" htmlFor="show">
                <span className="font-semibold">Show a warning when content is flagged</span>
                <span className="text-sm text-muted-foreground">
                  A warning will be shown when sexual, hateful, violent or self-harm content is detected.
                </span>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="secondary" onClick={() => setShowDeleteDialog(true)}>
        Delete preset
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will no longer be accessible by you or others you&apos;ve shared
              it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false);
                toast.info("Here's the toast!");
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
