import { useState } from "react";

export default function List({children}: {children: React.ReactNode}) {
	const [toggled, setToggled] = useState(false);

	return (
		<>
			<button onClick={() => setToggled(!toggled)}>
				{toggled ? "Hide" : "Show"}
			</button>
			{children}
		</>
	);
}
