import { useEffect, useRef, useState } from "react";
import Watch from "./Watch";
import Button from "./Button";
import Laps from "./Laps";

//  Logic: take a initial time ref which will work as the starting point and calculate elapsed time based on that, when pausing
// change the initial time => current time - elapsed time -> [meaning we will take our inital time from current time minus already elapsed time]
export default function Timer() {
    const [time, setTime] = useState(0);
    const initialTimeRef = useRef<null | number>(null);
    const intervalRef = useRef<null | ReturnType<typeof setInterval>>(null);
    const [laps, setLaps] = useState<number[]>([]);

    useEffect(() => {}, []);

    const handleStart = () => {
        if (intervalRef.current) return;

        if (!initialTimeRef.current) {
            let startTime = new Date().getTime();
            initialTimeRef.current = startTime;
        }

        intervalRef.current = setInterval(() => {
            const currentTime = new Date().getTime();

            const newTime = currentTime - initialTimeRef.current!;
            setTime(newTime);
        }, 100);
    };

    const handleStop = () => {
        setTime(0);
        intervalRef.current && clearInterval(intervalRef.current);
        intervalRef.current = null;
        initialTimeRef.current && (initialTimeRef.current = null);
    };

    const handlePause = () => {
        intervalRef.current && clearInterval(intervalRef.current);
        intervalRef.current = null;

        const currentTime = new Date().getTime();

        //This is important, time = elapsed time
        initialTimeRef.current && (initialTimeRef.current = currentTime - time);
    };

    const handleLap = () => {
        lapInterval(time);
    };

    const lapInterval = (lapTime: number) => {
        setLaps((prevLaps) => {
            return [...prevLaps, lapTime];
        });
    };

    return (
        <div>
            <Watch miliseconds={time} />
            <Button btnText="Start" onClick={handleStart} />
            <Button btnText="Stop" onClick={handleStop} />
            <Button btnText="Pause" onClick={handlePause} />
            <Button btnText="Lap" onClick={handleLap} />

            <Laps laps={laps} />
        </div>
    );
}
