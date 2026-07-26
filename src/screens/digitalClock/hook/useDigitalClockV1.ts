import { useState, useEffect } from "react";

export default function useDigitalClockV1() {
    // Initialize with Date.now() directly so it doesn't show "0:0:0:0" on the first render
    const [time, setTime] = useState<number>(Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(Date.now());
        }, 100);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const formatTime = () => {
        const date = new Date(time);
        
        // Use local timezone methods
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ms = date.getMilliseconds();

        // Format to 12-hour clock (or remove "% 12" logic if you want 24-hour clock)
        const displayHours = hours % 12 || 12; 
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Pad hours, minutes, seconds, and milliseconds
        const paddedHours = String(displayHours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');
        const paddedMs = String(ms).padStart(3, '0');

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}.${paddedMs} ${ampm}`;
    }

    return {
        time,
        formatTime,
    }
}
