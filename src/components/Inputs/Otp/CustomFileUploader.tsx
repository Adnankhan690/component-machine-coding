import { useState } from "react";
import "./custom-file-uploader.css";
import axios from "axios";

interface FileUploadState {
	state: "idle" | "uploading" | "success" | "error";
	progress: number;
	error?: string | null;
	uploadedFileUrl?: string | null;
}

interface UploadInfo { 
    rate: number;
    byteInfo: number;
    downloaded: boolean;
    uploaded: boolean;
}

export default function CustomFileUploader() {
	const [file, setFile] = useState<File | null>(null);
	const [uploadState, setUploadState] = useState<FileUploadState>({
		progress: 0,
		state: "idle",
    });
    
    const [uploadInfo, setUploadInfo] = useState<UploadInfo | null>(null);

	const [isDragOver, setIsDragOver] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files && e.target.files[0];

		if (selectedFile) {
			handleFileSelection(selectedFile);
		}
	};

	// Handle file selection from both input change and drag drop
	const handleFileSelection = (selectedFile: File) => {
		setFile(selectedFile);
		setUploadState({ progress: 0, state: "idle" });
	};

	// Drag and drop event handlers
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			const droppedFile = files[0];
			// Check file type (same validation as input)
			if (droppedFile.type === "image/png") {
				handleFileSelection(droppedFile);
			} else {
				alert("Please select a PNG file");
			}
		}
	};

	const handleFileUpload = async () => {
		if (!file) return;
		try {
			const formData = new FormData();
			formData.append("file", file);
			setUploadState({
				state: "uploading",
				progress: 0,
			});

			const res = await axios.post(
				"https://api.escuelajs.co/api/v1/files/upload",
				formData,
				{
					onUploadProgress(progressEvent) {
						const progress = Math.round(
							(progressEvent.loaded / progressEvent.total!) * 100
                        );
                        setUploadInfo((prev) => {
                            return {
                                ...prev,
                                byteInfo: progressEvent.bytes,
                                rate: progressEvent.rate || 0,
                                uploaded: progressEvent.loaded === progressEvent.total,
                                downloaded: false,
                            }
                        })
						setUploadState((prev) => {
							return {
								...prev,
								progress,
							};
						});
					},
				}
			);

			setUploadState({
				state: "success",
				progress: 100,
				uploadedFileUrl: res.data.location,
			});
		} catch (error: any) {
			setUploadState({
				state: "error",
				progress: 0,
				error: error.message || "Unknown error",
			});
		}
	};

	const renderFileUploads = () => {
		switch (uploadState?.state) {
			case "uploading":
				return (
					<div>
						uploading...
						<div className="progress-bar-con">
							<div className="progress-bar" style={{width: `${uploadState.progress}%`}}>{uploadState.progress}%</div>
						</div>
					</div>
				);

			case "success":
				return (
					<div>
						File uploaded successfully! URL: {uploadState.uploadedFileUrl}
					</div>
				);
			case "error":
				return <div>Error uploading file: {uploadState.error}</div>;
			default:
				null;
		}
	};

	return (
		<div>
			<hr />
			Custom File Uploader Component
			<label htmlFor="custom-file-uploader">
				<div
					className={`upload-con ${isDragOver ? "drag-over" : ""}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}>
					<div style={{ fontSize: "18px", marginBottom: "10px" }}>
						📁 Upload File
					</div>
					<div style={{ fontSize: "14px", color: "#666" }}>
						{isDragOver
							? "Drop file here..."
							: "Click here to select a file or drag and drop"}
					</div>
				</div>

				<input
					onChange={handleFileChange}
					type="file"
					id="custom-file-uploader"
					accept="image/png"
					style={{ display: "none" }}
				/>
			</label>
			{/* <div className="file-details">
				{file ? (
					<>
						<div>
							<strong>Selected File:</strong> {file.name}
						</div>
						<div>
							<strong>Size:</strong>
							{(file.size / 1024).toFixed(2)} KB
						</div>

						<div>
							<strong>Last modified:</strong>
							{new Date(file.lastModified).toDateString()}
						</div>
						<div>
							<strong>File Type:</strong>
							{file.type}
						</div>
					</>
				) : null}
			</div> */}
			<div>
				{uploadInfo ? (
					<div className="upload-info">
						<div>
							<strong>Upload Rate:</strong>{" "}
							{(uploadInfo.rate / 1024).toFixed(3)} kb/sec
						</div>
						<div>
							<strong>Bytes Uploaded:</strong> {uploadInfo.byteInfo} bytes
						</div>
						<div>
							<strong>Uploaded:</strong> {uploadInfo.uploaded ? "Yes" : "No"}
						</div>
						<div>
							<strong>Downloaded:</strong>{" "}
							{uploadInfo.downloaded ? "Yes" : "No"}
						</div>
					</div>
				) : null}
			</div>
			<div>
				<button onClick={handleFileUpload}>Upload file</button>
			</div>
			<div>{renderFileUploads()}</div>
		</div>
	);
}
