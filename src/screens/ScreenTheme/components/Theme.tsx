import useTheme from "@/contexts/ThemeProvider";

const ThemeMode = {
	LIGHT: "light",
	DARK: "dark",
};

export default function Theme() {
	const { toggleTheme, theme } = useTheme();

	console.log(theme);

	return (
		<div>
			<button onClick={toggleTheme}>Toggle Theme</button>
		</div>
	);
}
