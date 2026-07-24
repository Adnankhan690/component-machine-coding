import { useState, useEffect } from "react";

export default function useDigitalClockV1() {
    const [time, setTime] = useState<number>(0);

    // use useLayoutEffect;

    useEffect(() => {
        setTime(new Date().getTime())
    }, [time])

    return {
        time,
    }
}