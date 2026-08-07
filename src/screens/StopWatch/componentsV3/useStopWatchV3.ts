import { useState } from "react";

export default function useStopWatchV3() {
    const [time, setTime] = useState();

    const handleStart = () => {

    }

    const handlePause = () => {

    }

    const handleReset = () => {

    }

    return {
        time,
        handleStart,
        handlePause,
        handleReset,
    }
}