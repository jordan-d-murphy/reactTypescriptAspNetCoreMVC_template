import { useTheme } from "@/components/theme-provider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center p-1 ml-1 space-x-2">
      <Label htmlFor="toggle-mode">Dark</Label>
      <Switch id="toggle-mode" checked={isDark} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
      <Label htmlFor="toggle-mode">Light</Label>
    </div>
  );
}
