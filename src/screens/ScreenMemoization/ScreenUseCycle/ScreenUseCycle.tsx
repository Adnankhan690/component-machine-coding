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