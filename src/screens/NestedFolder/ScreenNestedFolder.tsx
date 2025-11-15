//REQUIREMENTS:
//**
// 1. add folder, delete folder, rename/edit folder, add file to a folder
// 2. add nested UI
// 3. collapse/expand folder
// 4. persist data across page refresh using local storage
// 5. sync folder structure across multiple tabs
//    i.e., open 3 tabs and modify the folder in any one of the Tab,  then the rest of the tab should also reflect the modification
// 6. set a expiry time for the data in local storage ( say 1 hour) after which the data should be cleared from local storage
// 10. Implement this using COMPUND COMPONENT PATTERN [later]
// 6. TODO : Add drag and drop feature [later]
// 7. TODO : Add right click context menu [later]
// 8. TODO : Add file preview feature [later]
// 9. TODO : Add search feature [later]
// */

import {
	nestedData,
	nestedFolderDataType,
} from "@/components/NestedFolder/Data/nestedFolderData";
import NestedFolder from "@/components/NestedFolder/NestedFolder";
import {
	loadFromStorage,
	NESTED_KEY,
	saveToStorage,
} from "@/utils/utilsStorage";
import { useEffect, useState } from "react";

export default function ScreenNestedFolder() {
	const [nestedFolderData, setNestedFolderdata] = useState<
		nestedFolderDataType[]
	>(() => loadFromStorage() || nestedData);

	useEffect(() => {
		saveToStorage(NESTED_KEY, nestedFolderData);
	}, [nestedFolderData]);

	useEffect(() => {
		const handleTabSync = (event: StorageEvent) => {
			if (event.key === NESTED_KEY) {
				const newData = event.newValue;
				if (newData) {
					setNestedFolderdata(JSON.parse(newData));
				}
			}
		};

		window.addEventListener("storage", handleTabSync);

		return () => {
			window.removeEventListener("storage", handleTabSync);
		};
	}, []);

	return (
		<div>
			<NestedFolder
				setNestedFolderdata={setNestedFolderdata}
				nestedFolderData={nestedFolderData}
			/>
		</div>
	);
}
