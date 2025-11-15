import axios from "axios";
import { useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadState {
	status: UploadStatus;
	progress: number;
	error?: string;
	uploadedFileUrl?: string;
}

export default function FileUploader() {
	const [file, setFile] = useState<File | null>(null);
	const [uploadState, setUploadState] = useState<UploadState>({
		status: "idle",
		progress: 0,
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if ((e.target.files && e.target.files.length < 1) || e.target === null)
			return;

		if (e.target.files && e.target.files.length > 0) {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);
			// Reset upload state when new file is selected
			setUploadState({
				status: "idle",
				progress: 0,
			});
		}
	};

	const handleFileUpload = async () => {
		if (!file) {
			console.log("No file selected for upload.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		// Set uploading state
		setUploadState({
			status: "uploading",
			progress: 0,
		});

		try {
			const res = await axios.post(
				"https://api.escuelajs.co/api/v1/files/upload",
				formData,
				{
					onUploadProgress(progressEvent) {
						const progress = Math.round(
							(progressEvent.loaded / progressEvent.total!) * 100
						);
						console.log("upload progress:", progress);

						setUploadState((prev) => ({
							...prev,
							progress,
						}));
					},
				}
			);

			// Upload successful
			setUploadState({
				status: "success",
				progress: 100,
				uploadedFileUrl: res.data.location || res.data.url, // Adjust based on API response
			});

			console.log("Upload successful:", res.data);
		} catch (error: any) {
			// Upload failed
			setUploadState({
				status: "error",
				progress: 0,
				error:
					error.response?.data?.message || error.message || "Upload failed",
			});
			console.error("Upload error:", error);
		}
	};

	const renderUploadStatus = () => {
		switch (uploadState.status) {
			case "uploading":
				return (
					<div style={{ marginTop: "10px" }}>
						<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
							<div>🔄 Uploading...</div>
							<div>{uploadState.progress}%</div>
						</div>
						<div
							style={{
								width: "100%",
								height: "10px",
								backgroundColor: "#f0f0f0",
								borderRadius: "5px",
								overflow: "hidden",
								marginTop: "5px",
							}}>
							<div
								style={{
									width: `${uploadState.progress}%`,
									height: "100%",
									backgroundColor: "#4CAF50",
									transition: "width 0.3s ease",
									borderRadius: "5px",
								}}
							/>
						</div>
					</div>
				);
			case "success":
				return (
					<div style={{ marginTop: "10px", color: "#4CAF50" }}>
						<div>✅ Upload successful!</div>
						{uploadState.uploadedFileUrl && (
							<div style={{ fontSize: "12px", marginTop: "5px" }}>
								<a
									href={uploadState.uploadedFileUrl}
									target="_blank"
									rel="noopener noreferrer">
									View uploaded file
								</a>
							</div>
						)}
					</div>
				);
			case "error":
				return (
					<div style={{ marginTop: "10px", color: "#f44336" }}>
						<div>❌ Upload failed</div>
						<div style={{ fontSize: "12px", marginTop: "5px" }}>
							{uploadState.error}
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div style={{ padding: "20px", maxWidth: "500px" }}>
			<label htmlFor="file-uploader" style={{ cursor: "pointer" }}>
				<div
					style={{
						border: "2px dashed #ccc",
						padding: "20px",
						textAlign: "center",
						borderRadius: "8px",
						backgroundColor: file ? "#f9f9f9" : "transparent",
					}}>
					<div style={{ fontSize: "18px", marginBottom: "10px" }}>
						📁 Upload File
					</div>
					<div style={{ fontSize: "14px", color: "#666" }}>
						Click here to select a file or drag and drop
					</div>
				</div>
				<input
					onChange={handleFileChange}
					type="file"
					id="file-uploader"
					accept=".png,.jpg,.jpeg,.gif,.pdf,.txt"
					style={{ display: "none" }}
				/>
			</label>

			{file && (
				<div
					style={{
						marginTop: "15px",
						padding: "15px",
						backgroundColor: "#f5f5f5",
						borderRadius: "8px",
					}}>
					<h4 style={{ margin: "0 0 10px 0" }}>Selected File Info:</h4>
					<div style={{ fontSize: "14px", lineHeight: "1.5" }}>
						<div>
							<strong>Name:</strong> {file.name}
						</div>
						<div>
							<strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
						</div>
						<div>
							<strong>Type:</strong> {file.type}
						</div>
						<div>
							<strong>Last Modified:</strong>{" "}
							{new Date(file.lastModified).toLocaleDateString()}
						</div>
					</div>
				</div>
			)}

			{renderUploadStatus()}

			<button
				onClick={handleFileUpload}
				disabled={!file || uploadState.status === "uploading"}
				style={{
					marginTop: "15px",
					padding: "10px 20px",
					backgroundColor:
						uploadState.status === "uploading" ? "#ccc" : "#007bff",
					color: "white",
					border: "none",
					borderRadius: "5px",
					cursor:
						uploadState.status === "uploading" ? "not-allowed" : "pointer",
					fontSize: "16px",
				}}>
				{uploadState.status === "uploading" ? "Uploading..." : "Upload File"}
			</button>
		</div>
	);
}
