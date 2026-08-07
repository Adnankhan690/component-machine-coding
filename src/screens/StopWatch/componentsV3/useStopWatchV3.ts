import { useRef, useState } from "react";

export default function useStopWatchV3() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timeRef = useRef<number>(0);
    const timerIdRef = useRef<ReturnType<typeof setInterval>>(null);

    const handleStart = () => {
        if (timerIdRef.current) return;

        setIsRunning(true);
        timeRef.current = new Date().getTime();
        const newTime = new Date().getTime() - time;

        timerIdRef.current = setInterval(() => {
            const ms = new Date().getTime() - newTime;
            setTime(ms)
        }, 10)

    }

    const handlePause = () => {
        if (!timerIdRef.current) return;

        clearInterval(timerIdRef.current);
        setIsRunning(false);
        timerIdRef.current = null;
    }

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
        timeRef.current = 0;
    }

    const formatTime = () => {
        const ms = Math.floor((time % 1000)).toString().padStart(2, "0");
        const second = Math.floor((time / 1000) % 60).toString().padStart(2, "0");
        const minutes = Math.floor(((time / (1000 * 60)) % 60)).toString().padStart(2, "0");
        const hour = Math.floor(((time / (1000 * 60 * 60)) % 60)).toString().padStart(2, "0");

        return `${hour}: ${minutes}: ${second}: ${ms}`;
    }

    return {
        time,
        handleStart,
        handlePause,
        handleReset,
        formatTime,
        isRunning
    }
}