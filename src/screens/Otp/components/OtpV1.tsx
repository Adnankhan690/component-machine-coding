import "../otpv1.css";
import useOtpV1 from "../hooks/useOtpV1";

export default function OtpV1() {
    const { otp, handleChange, inputRef, handleKeyDown } = useOtpV1();

    return (
        <div>
            OTPV1

            <div className="input-wrapper">
                {otp.map((num, idx) => {
                    return (
                        <div key={idx}>
                            <input
                                ref={(element) => {
                                    inputRef.current[idx] = element;
                                }}
                                // ref={inputRef}
                                type="number"
                                value={num}
                                onChange={(e) => handleChange(e, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}