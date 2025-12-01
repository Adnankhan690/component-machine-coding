//When to use Render Prop Pattern?
// The render prop pattern in React is useful whenever you want logic reuse, state sharing, or behavior customization without 
// relying on inheritance, HOCs, or custom hooks. Although hooks reduced its necessity, 
// render props are still relevant in some cases—especially when you want very fine-grained control over rendering.

//https://www.youtube.com/watch?v=ZNkwkm4TfzE

import Button from "./components/Button";

export default function ScreenRenderPropPattern() {
	return (
		<div>
			<Button
				render={(props) => {
					return (
						<button
							onClick={props.onClick}               
							style={{
								backgroundColor: "red",
								color: "white",
								padding: "10px 20px",
								borderRadius: "4px",
							}}>
							custom button
						</button>
					);
				}}
			/>
		</div>
	);
}
