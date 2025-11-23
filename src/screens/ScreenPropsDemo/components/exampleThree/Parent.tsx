//Data communication from Child to Parent - Example Three

import { useState } from "react";
import ChildTwo from "./Child";

export default function Parent() {
    const [childData, setChildData] = useState<string>("");

    const readDataFromChild = (data: string) => {
        console.log("Data received from Child:", data);
        setChildData(data);
    }

    return (
        <div>
            <h2>Parent Component</h2>
            <ChildTwo  extractDataFromChild={readDataFromChild} />
            <p>Data received from Child: {childData}</p>
        </div>
    );
}