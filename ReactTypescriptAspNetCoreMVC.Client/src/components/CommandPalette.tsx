import React, { useState } from "react";
// import { useHotkey } from "@/hooks/useHotKey";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Calendar, Smile, Calculator, User, CreditCard, Settings } from "lucide-react";
import { useHotkey } from "@/hooks/useHotkey";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useHotkey(["j"], () => setOpen((prev) => !prev)); // ⌘+J or Ctrl+J

  return (
    <>
      {open && (
        <CommandDialog open={open} onOpenChange={setOpen}>
          <div className="glow-sweep rounded-lg p-[2px] border-none">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <Calendar />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <Smile />
                  <span>Search Emoji</span>
                </CommandItem>
                <CommandItem>
                  <Calculator />
                  <span>Calculator</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <User />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCard />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </div>
        </CommandDialog>
      )}
    </>
  );
}
