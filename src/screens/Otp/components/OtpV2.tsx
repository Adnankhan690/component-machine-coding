import useOTPV2 from "../hooks/useOtpV2";

export default function OTPV2() {
    const { otp, handleChange, otpRef, handleKeyDown, disabledInput,
        handlePaste,
    } = useOTPV2();

    return (
        <div>
            V2
            <div>
                {otp.map((val, indx) => (
                    <div key={indx}>
                        <input value={val}
                            onChange={(e) => handleChange(e, indx)}
                            ref={(e) => {
                                otpRef.current[indx] = e as HTMLInputElement
                            }}
                            onKeyDown={(e) => handleKeyDown(e, indx)}
                            disabled={disabledInput[indx]}
                            onPaste={handlePaste}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}