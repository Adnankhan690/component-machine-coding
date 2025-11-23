import React from "react";

//always de-structure props in the function parameters
function Child({ count }: { count: number }) {

    console.log("hellow");
    
    return (
        <div>
            <h2>Child Component</h2>
        </div>
    )
}

//This will prevent re-rendering of Child component when Parent re-renders
//NOTE: React.memo does a shallow comparison of props
//If props are primitive types (string, number, boolean), it works fine
//If props are reference types (object, array, function), it may not work as expected


//IN this case, prop is being changed so Child will re-render, but if prop is not changed, Child will not re-render
//suppose Parent re-renders due to some other state change, Child will not re-render if count prop is same as before
//This is useful for performance optimization in large component trees
//However, overuse of React.memo can lead to unnecessary complexity and maintenance overhead
//so it should be used judiciously

//suppose if count was not present, that is if the props were empty, then Child would never re-render after the first render
export default React.memo(Child);