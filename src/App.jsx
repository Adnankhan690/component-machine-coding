import "./App.css";
import RouteManager from "./app/routes/RouteManager";
import { ThemeProvider } from "./contexts/ThemeProvider";

function App() {
	return (
		<ThemeProvider>
			<div className="app">
				<RouteManager />
			</div>
		</ThemeProvider>
	);
}

export default App;
