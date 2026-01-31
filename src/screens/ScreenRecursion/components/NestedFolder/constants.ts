export interface FolderConfig {
	id: string;
	name: string;
	children: FolderConfig[];
	isCollapsed: boolean;
	isFolder: boolean;
}

export const folderConfig: FolderConfig[] = [
	{
		id: "1",
		name: "src",
		isFolder: true,
		isCollapsed: true,
		children: [
			{
				id: "2",
				name: "components",
				isFolder: true,
				isCollapsed: false,
				children: [
					{
						id: "3",
						name: "Button",
						isFolder: true,
						isCollapsed: false,
						children: [
							{
								id: "4",
								name: "index.tsx",
								isFolder: false,
								isCollapsed: false,
								children: [],
							},
							{
								id: "5",
								name: "styles.css",
								isFolder: false,
								isCollapsed: false,
								children: [],
							},
						],
					},
					{
						id: "6",
						name: "Input",
						isFolder: true,
						isCollapsed: false,
						children: [
							{
								id: "7",
								name: "index.tsx",
								isFolder: false,
								isCollapsed: false,
								children: [],
							},
						],
					},
				],
			},
			{
				id: "8",
				name: "utils",
				isFolder: true,
				isCollapsed: false,
				children: [
					{
						id: "9",
						name: "helpers.ts",
						isFolder: false,
						isCollapsed: false,
						children: [],
					},
				],
			},
			{
				id: "10",
				name: "App.tsx",
				isFolder: false,
				isCollapsed: false,
				children: [],
			},
			{
				id: "11",
				name: "index.css",
				isFolder: false,
				isCollapsed: false,
				children: [],
			},
		],
	},
	{
		id: "12",
		name: "package.json",
		isFolder: false,
		isCollapsed: false,
		children: [],
	},
	{
		id: "13",
		name: "tsconfig.json",
		isFolder: false,
		isCollapsed: false,
		children: [],
	},
];
