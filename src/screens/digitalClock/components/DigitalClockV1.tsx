import useDigitalClockV1 from "../hook/useDigitalClockV1";

export default function DigitalClockV1() {
    const {time} = useDigitalClockV1();
    
    return(
        <div>{time}</div>
    )
}