import { useState } from "react";
import DemoUseInputControlHook from "./DemoUseInputControlHook";

export default function DemoWrapper() {
	const [name, setName] = useState("Adnan");

	return (
		<div>
			<button onClick={() => setName("Adnan Khan")}>
				click me to re-render child
			</button>
			<DemoUseInputControlHook defaultValye={name} />
		</div>
	);
}
