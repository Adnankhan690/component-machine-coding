import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import "./componentc.css";
import Routes from "@/app/routes/Routes";

function ComponentC() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const modalType = searchParams.get("modal");

	useEffect(() => {
		// ✅ Open modal only if URL has ?modal=something
		//TODO: we can call an API here to fetch data as well
		if (modalType) {
			setIsModalOpen(true);
		} else {
			setIsModalOpen(false);
		}
	}, [modalType]); // react only to URL param changes

	const openModal = () => {
		setSearchParams({ modal: "addUser" });
	};

	const closeModal = () => {
		setSearchParams({}); // remove modal param from URL
	};

	return (
		<div>
			<h1>Dashboard</h1>
			<button onClick={openModal}>Open Modal</button>
			<NavLink to={Routes.SCREEN_INPUT} className={(data) => "s"
			}>
				I am nav `➡️` Input Screen
			</NavLink>
				{isModalOpen && (
				//TODO: this is the original way
				// <Modal onClose={closeModal}>
				// 	<h2>Add User</h2>
				// 	<button onClick={closeModal}>Close</button>
				// </Modal>

				<div className="modal">
					<h2>I am like a modal</h2>
					<button onClick={closeModal}>Close</button>
				</div>
			)}
		</div>
	);
}

export default ComponentC;
