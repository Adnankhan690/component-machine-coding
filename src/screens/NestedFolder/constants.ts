export type FolderType = {
	id: string;
	name: string;
	isFolder: boolean;
	isCollapsed: boolean;
	children?: FolderType[];
};

export const folders: FolderType[] = [
	{
		id: "1",
		name: "src",
		isFolder: true,
		isCollapsed: false,
		children: [
			{
				id: "1-1",
				name: "screens",
				isFolder: true,
				isCollapsed: false,
				children: [
					{
						id: "1-1-1",
						name: "ScreenNestedFolder.tsx",
						isFolder: false,
						isCollapsed: false,
					},
				],
			},
		],
	},
	{
		id: "2",
		name: "components",
		isFolder: true,
		isCollapsed: false,
		children: [],
	},
	{
		id: "3",
		name: "App.tsx",
		isFolder: false,
		isCollapsed: false,
		children: [],
	},
	{
		id: "4",
		name: "package.json",
		isFolder: false,
		isCollapsed: false,
		children: [],
	},
];
