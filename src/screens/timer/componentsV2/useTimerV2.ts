import { useState } from "react";

export interface TimeInput {
    minute: number,
    second: number,
}

export default function useTimerV2() {
    const [input, setInput] = useState<TimeInput>({
        minute: 0,
        second: 0,
    });

    const handleStart = () => {

    }

    const handlePause = () => {

    }

    return {
        handleStart,
        handlePause,
        input
    }
}