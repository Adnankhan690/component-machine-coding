import Dialog from "@/components/Dialog/Dialog";
import DialogV2 from "@/components/Dialog/DialogV2";
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

			 <DialogV2 />
		</div>
	);
}
