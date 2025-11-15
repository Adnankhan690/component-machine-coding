import { NavigateFunction } from "react-router-dom";
import Routes from "../routes/Routes";

export const fetchData = async (url: string, navigate: NavigateFunction) => {
	const response = await fetch(url);
	if (!response.ok) {
		navigate(Routes.HOME);
		throw new Error("Network response was not ok");
	}
	const res = await response.json();
	return res;
};