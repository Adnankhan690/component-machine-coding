//Data communication from Parent to Child - Example Two

import ChildTwo from "./Child";

export default function Parent() {
    const parentdata = "Data from Parent Component";

    return (
        <div>
            <h2>Data transfer from Parent to Child</h2>
            <ChildTwo parentData={parentdata}  />
        </div>
    );
}