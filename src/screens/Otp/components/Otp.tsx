import "../otp.css";
import useOtp from "../hooks/useOtp";

export default function OTP() {
    const {
        otp,
        handleInput,
        otpInputRef,
        handleKeyDown,
        disabledInput
    } = useOtp();

    return (
        <div>
            OT
            <div className="input-wrapper">
                {otp.map((val, idx) => {
                    return (
                        <div key={idx}>
                            <input
                                disabled={disabledInput[idx]}
                                className={disabledInput[idx] ? 'disabled' : 'enabled'}
                                onChange={(e) => handleInput(e, idx)}
                                value={val}
                                ref={(e) => { otpInputRef.current[idx] = e as HTMLInputElement }}
                                onKeyDown={(e) => { handleKeyDown(e, idx) }}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}