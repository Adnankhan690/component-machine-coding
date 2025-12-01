import FileUploader from "@/components/Inputs/Otp/FileUploader";
import Otp from "@/components/Inputs/Otp/Otp";
import { useLocation } from "react-router-dom";
import "./input-con.css";
import CustomFileUploader from "@/components/Inputs/Otp/CustomFileUploader";
import MultipleFileUploader from "@/components/Inputs/Otp/MultipleFileUploader";
import CustomOtp from "@/components/Inputs/Otp/PracticeOtp";
import OtpWithRenderProp from "@/components/Inputs/Otp/OtpWithRenderProp";

export default function ScreenInput() {
	const location = useLocation();

	console.log("location state:", location.state);

	return (
		<>
			<div>Input screen</div>
			<div className="input-con">
				{/* Default OTP */}
				<div>
					<h3>Default OTP:</h3>
					<CustomOtp onComplete={(otp) => console.log("OTP Completed:", otp)} />
				</div>
				<hr />
				{/* Custom Styled OTP with Render Props */}
				<div>
					<h3>Custom Styled OTP (Render Props):</h3>
					<CustomOtp
						inputLength={4}
						onComplete={(otp) => alert(`Custom OTP Completed: ${otp}`)}
						renderInput={(props) => (
							<input
								type="text"
								value={props.value}
								onChange={props.onChange}
								onKeyDown={props.onKeyDown}
								onPaste={props.onPaste}
								disabled={props.disabled}
								ref={props.ref}
								style={{
									width: "60px",
									height: "60px",
									textAlign: "center",
									fontSize: "24px",
									fontWeight: "bold",
									borderRadius: "12px",
									border: props.value ? "3px solid #4CAF50" : "3px solid #ccc",
									backgroundColor: props.disabled ? "#f5f5f5" : "white",
									color: props.value ? "#4CAF50" : "#333",
									outline: "none",
									transition: "all 0.2s ease",
								}}
								placeholder="•"
							/>
						)}
						renderContainer={(props) => (
							<div
								style={{
									display: "flex",
									gap: "12px",
									justifyContent: "center",
									padding: "20px",
									backgroundColor: "#f9f9f9",
									borderRadius: "16px",
									border: "1px solid #e0e0e0",
								}}>
								{props.children}
								{props.isComplete && (
									<div
										style={{
											marginLeft: "16px",
											color: "#4CAF50",
											fontWeight: "bold",
										}}>
										✅ Complete!
									</div>
								)}
							</div>
						)}
					/>
				</div>
				<hr />
				{/* Rounded Pills Style */}
				<div>
					<h3>Rounded Pills Style:</h3>
					<CustomOtp
						inputLength={6}
						renderInput={(props) => (
							<input
								type="text"
								value={props.value}
								onChange={props.onChange}
								onKeyDown={props.onKeyDown}
								onPaste={props.onPaste}
								disabled={props.disabled}
								ref={props.ref}
								style={{
									width: "45px",
									height: "45px",
									textAlign: "center",
									fontSize: "18px",
									borderRadius: "50px",
									border: "none",
									backgroundColor: props.value ? "#3b82f6" : "#e5e7eb",
									color: props.value ? "white" : "#6b7280",
									outline: "none",
									boxShadow: props.value
										? "0 4px 12px rgba(59, 130, 246, 0.4)"
										: "none",
									transform: props.value ? "scale(1.05)" : "scale(1)",
									transition: "all 0.3s ease",
								}}
							/>
						)}
					/>
				</div>

				<hr />
				Input with render-prop
				<OtpWithRenderProp />
				<hr />
				
				<hr />
				{/* Original Components */}
				<Otp />
				<FileUploader />
				<CustomFileUploader />
				<hr />
				<MultipleFileUploader />
			</div>
		</>
	);
}
