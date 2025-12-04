// Implement a useCycle hook that cycles through a sequence of values each time its function is called.


// export default function Component() {
//   const [mode, cycle] = useCycle('low', 'medium', 'high');

//   return (
//     <div>
//       <p>State: {mode}</p>
//       <button onClick={cycle}>Cycle</button>
//     </div>
//   );
// }
// Arguments
// The useCycle hook should accept an indefinite number of arguments, each representing a value in the sequence to cycle through.

// Returns
// A tuple containing the following elements:


import useCycle from "@/hooks/useCycle";

export default function ScreenUseCycle() {
    const { cycle, value } = useCycle("First", "Second", "Third");
    
    return (
        <div>
            <h2>Screen Use Cycle</h2>
            <p>This is the Screen Use Cycle Demo</p>

            <button onClick={cycle}>cycle</button>
            <div>Current Value: {value}</div>
        </div>
    );
}