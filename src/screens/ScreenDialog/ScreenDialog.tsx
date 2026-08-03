import Dialog from "@/components/Dialog/Dialog";
import DialogV2 from "@/components/Dialog/DialogV2";
import DialogV3 from "@/components/Dialog/v3/DialogV3";
import { useState } from "react";

export default function ScreenDialog() {
	const [openDialog, setOpenDialog] = useState(false);

	const handleClick = () => {
		setOpenDialog(true);
	};

	return (
		<div>
			{/* Dialog Demo
			<button onClick={handleClick}>{openDialog ? "close" : "show"}</button>
			<Dialog
			showModal={openDialog}
			onClose={() => {
				setOpenDialog(false);
				}}>
                <h1>I am Chldren</h1>
                <button>Cancel</button>
                <button>Submit</button>
				</Dialog>
				*/}

			{/* <button onClick={handleClick}>{openDialog ? "close" : "show"}</button>
			<DialogV2 show={openDialog}
				onClose={() => {
					setOpenDialog(false);
				}}
			>
				<label htmlFor="input">Name: </label>
				<input id="input" placeholder="Enter" />
				<button>cancel</button>
				<p>Hello Andna</p>
				<button>Save</button>
				<textarea placeholder="I am text area" />
			</DialogV2> */}

			<button onClick={handleClick}>{openDialog ? "close" : "show"}</button>

			<DialogV3 show={openDialog}
				onClose={() => {
					setOpenDialog(false);
				}}
			>
				<label htmlFor="input">Name: </label>
				<input id="input" placeholder="Enter" />
				<button>cancel</button>
				<p>Hello Andna</p>
				<button>Save</button>
				<textarea placeholder="I am text area" />
			</DialogV3>
		</div>
	);
}
