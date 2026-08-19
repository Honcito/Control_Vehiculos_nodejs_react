import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import "../navbar.css";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("abyss");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "abyss");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "abyss" ? "nord" : "abyss";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-button flex items-center justify-center text-base-content border-0 outline-none"
      aria-label="Cambiar tema"
    >
      {theme === "abyss" ? (
        <Sun className="w-6 h-6 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-6 h-6 text-blue-300 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;