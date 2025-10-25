"use client";
import { Import, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // avoid SSR mismatch

  const current = theme === "system" ? systemTheme : theme;
  return (
    <button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="rounded-xl px-1.5 py-1.5 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle dark mode"
    >
      {current === "dark" ? <Moon /> : <Sun />}
    </button>
  );
}
