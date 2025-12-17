import { createContext, useContext, useState } from "react";

const ThemeMode = {
	LIGHT: "light",
	DARK: "dark",
};

interface ThemeContextType {
	toggleTheme: () => void;
	theme: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState(ThemeMode.LIGHT);

	const handleToggleTheme = () => {
		const element = document.getElementsByTagName("body")[0];
		const existingTheme = element.classList.contains(ThemeMode.DARK)
			? ThemeMode.DARK
			: ThemeMode.LIGHT;

		removeTheme(element, existingTheme);

		const newTheme =
			existingTheme === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;

		element.classList.add(newTheme);
		setTheme(newTheme);
	};

	const removeTheme = (element: HTMLBodyElement, existingTheme: string) => {
		element.classList.remove(existingTheme);
	};

	return (
		<ThemeContext.Provider value={{ toggleTheme: handleToggleTheme, theme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export default function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}
