import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeSaved = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModeSaved);
    if (darkModeSaved) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  return (
    <Button
      id="darkModeToggle"
      onClick={toggleDarkMode}
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
