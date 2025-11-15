export interface nestedFolderDataType {
	name: string;
	isFolder: boolean;
    id: string;
    isCollapsed: boolean;
	children: nestedFolderDataType[];
}

export const nestedData: nestedFolderDataType[] = [
	{
		name: "src",
		isFolder: true,
		id: "1",
		isCollapsed: false,
		children: [
			{
				name: "components",
				isFolder: true,
				id: "2",
				children: [
					{
						name: "Button.tsx",
						isFolder: false,
						id: "3",
						isCollapsed: false,
						children: [],
					},
				],
				isCollapsed: false,
			},
		],
	},
	{
		name: "package.json",
		isFolder: false,
		id: "4",
		isCollapsed: false,
		children: [],
	},
];
