interface WatchProps {
    miliseconds: number;
}

export function formatTime(miliseconds: number) {
    //61234
    const miliSec = miliseconds % 1000; //234
    const seconds = Math.floor(miliseconds / 1000) % 60;
    const minute = miliseconds / (1000 * 60) % 60;
    const hour = miliseconds / (1000 * 60 * 60) % 24;

    const formattedHour = Math.floor(hour).toString().padStart(2, "0");
    const formattedMinute = Math.floor(minute).toString().padStart(2, "0");
    const formattedSeconds = Math.floor(seconds).toString().padStart(2, "0");
    const formattedMiliSec = miliSec.toString().padStart(3, "0");

    return `${formattedHour}:${formattedMinute}:${formattedSeconds}.${formattedMiliSec}`;
}

export default function Watch({miliseconds = 0}: WatchProps) {
    return <div>
        {formatTime(miliseconds)}
    </div>;
}