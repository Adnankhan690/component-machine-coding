import { useNavigate, useSearchParams } from "react-router-dom";
import "./componentb.css";
import Routes from "@/app/routes/Routes";

function ComponentB() {
	const [searchParam, setSearchParam] = useSearchParams();
	const navigate = useNavigate();

	const handleClick = () => {
		const newParams = new URLSearchParams(searchParam);
		newParams.set("key", "value");
		setSearchParam(newParams);
	};

	const handleAddParamUsingJs = () => {
		const params = new URLSearchParams(window.location.search);
		params.set("key2", "usingJS");
		window.history.replaceState(
			{},
			"",
			`${window.location.pathname}?${params.toString()}`
		);
	};

	const handleRemoveQueryParam = () => {
		// 		If you call setSearchParams({}), it removes all params —
		// so if you only want to delete one, always clone and delete like this:
		const newParam = new URLSearchParams(searchParam);
		newParam.delete("key");
		setSearchParam(newParam);
	};

	const handleUpdateQueryParam = () => {
		const newParam = new URLSearchParams(searchParam);
		newParam.set("key", "updated Value");
		setSearchParam(newParam);
	};

	const handleHistoryBack = () => {
		window.history.back();
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleGoForward = () => {
		navigate(+1);
	};

	const handleNavigateScreen = () => {
		navigate(Routes.SCREEN_INPUT, {
			replace: true,
			state: { from: "ComponentB" },
		});
	};

	return (
		<div className="componentB">
			<h1>Component B</h1>
			<p>
				NOTE: Note: To avoid unexpected behavior, don’t mix React Router–based
				buttons with JavaScript-based ones.
			</p>
			<button onClick={handleClick}>+using react-router-dom</button>
			<button onClick={handleAddParamUsingJs}>+using js</button>
			<button onClick={handleHistoryBack}>+ window history BACK (JS)</button>
			<button onClick={handleRemoveQueryParam}>
				+ rm: 'key' param (react-router)
			</button>
			<button onClick={handleUpdateQueryParam}>
				+ update: 'key' param value (react-router)
			</button>
			<button onClick={handleGoBack}>+ go back (react-router)</button>
			<button onClick={handleGoForward}>+ go forward (react-router)</button>
			<button onClick={handleNavigateScreen}>
				+ go to Input Screen/Tab (react-router)
			</button>
		</div>
	);
}

export default ComponentB;
