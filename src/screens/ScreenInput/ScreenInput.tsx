import FileUploader from "@/components/Inputs/Otp/FileUploader";
import Otp from "@/components/Inputs/Otp/Otp";
import { useLocation } from "react-router-dom";
import "./input-con.css";
import CustomFileUploader from "@/components/Inputs/Otp/CustomFileUploader";

export default function ScreenInput() {
	const location = useLocation();

	console.log("location state:", location.state);

	return (
		<>
			<div>Input screen</div>
			<div className="input-con">
				<Otp />
				<FileUploader />
				<CustomFileUploader />
			</div>
		</>
	);
}
