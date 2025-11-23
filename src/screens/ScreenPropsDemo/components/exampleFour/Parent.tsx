// Accessing function of Child component from Parent component - Example Four
// https://rahuulmiishra.medium.com/when-to-use-forwardref-23d8e366ec1e -> forwardRef explanation
// https://rahuulmiishra.medium.com/useimperativehandle-hook-c9cdef239650 -> useImperativeHandle explanation
// https://chatgpt.com/c/69215d7e-e3d4-8324-87a8-a330b059d48a


import { useRef } from "react";
import Child from "./Child";
import Card from "./Card";

interface ChildHandle extends HTMLDivElement {
    fnMode: () => void;
    getMode: () => boolean;
};

export default function Parent() {
    const childRef = useRef<ChildHandle | null>(null);
    let childMode = false;

    const handleClick = () => {
        if (!childRef.current) return;
        childRef.current.fnMode();
        childMode = childRef.current.getMode();
        console.log("child mode", childMode);
        
    }

    return (
        <div>
            <h1>Parent Component</h1>
            <button onClick={handleClick}>I am parent toggle mode</button>
            <Child onClick={handleClick} ref={childRef} />
            <Card mode={childMode} />
        </div>
    );
}