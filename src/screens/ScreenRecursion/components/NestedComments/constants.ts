export interface CommentsConfig {
	value: string;
	id: string;
	likes: number;
	children?: CommentsConfig[];
}

export const COMMENTS_CONFIG: CommentsConfig[] = [
	{
		id: "1",
		likes: 0,
		value: "Best places to visit in India",
		children: [
			{
				id: "1-1",
				likes: 0,
				value:
					"You should definitely visit Goa! Beautiful beaches and vibrant nightlife.",
				children: [
					{
						id: "1-1-1",
						likes: 0,
						value: "Which beach in Goa is the best?",
						children: [
							{
								id: "1-1-1-1",
								likes: 0,
								value: "Palolem Beach is amazing for a peaceful experience!",
							},
							{
								id: "1-1-1-2",
								likes: 0,
								value: "I prefer Anjuna Beach for the parties and flea market.",
							},
						],
					},
					{
						id: "1-1-2",
						likes: 0,
						value: "Don't forget to try the seafood there!",
					},
				],
			},
			{
				id: "1-2",
				likes: 0,
				value: "Kerala is a must-visit! The backwaters are stunning.",
				children: [
					{
						id: "1-2-1",
						likes: 0,
						value: "Agreed! I loved the houseboat experience in Alleppey.",
						children: [
							{
								id: "1-2-1-1",
								likes: 0,
								value: "How much did the houseboat cost?",
							},
						],
					},
					{
						id: "1-2-2",
						likes: 0,
						value: "Munnar tea gardens are also breathtaking!",
					},
				],
			},
			{
				id: "1-3",
				likes: 0,
				value:
					"Rajasthan for the culture and history - Jaipur, Udaipur, Jaisalmer!",
				children: [
					{
						id: "1-3-1",
						likes: 0,
						value: "The forts and palaces are incredible!",
						children: [
							{
								id: "1-3-1-1",
								likes: 0,
								value: "Amber Fort in Jaipur is my favorite!",
							},
							{
								id: "1-3-1-2",
								likes: 0,
								value:
									"Lake Palace in Udaipur is like something out of a fairy tale.",
							},
						],
					},
				],
			},
		],
	},
	{
		id: "1-4",
		likes: 0,
		value: "Don't miss Ladakh if you love mountains and adventure!",
		children: [
			{
				id: "1-4-1",
				likes: 0,
				value: "Pangong Lake is on my bucket list!",
			},
			{
				id: "1-4-2",
				likes: 0,
				value: "The bike ride from Manali to Leh is epic!",
			},
		],
	},
	{
		id: "1-5",
		likes: 0,
		value: "Varanasi for a spiritual experience unlike anywhere else.",
	},
	{
		id: "2",
		likes: 0,
		value: "What about Himachal Pradesh? Best for hill stations!",
		children: [
			{
				id: "2-1",
				likes: 0,
				value: "Shimla is overrated tbh. Try Kasol instead!",
				children: [
					{
						id: "2-1-1",
						likes: 0,
						value: "Kasol is amazing for backpackers and nature lovers!",
						children: [
							{
								id: "2-1-1-1",
								likes: 0,
								value: "The trek to Kheerganga from Kasol is unforgettable!",
							},
						],
					},
					{
						id: "2-1-2",
						likes: 0,
						value: "Or Mcleodganj if you want Tibetan culture and monasteries.",
					},
				],
			},
			{
				id: "2-2",
				likes: 0,
				value:
					"Manali is perfect for adventure sports - paragliding, skiing, rafting!",
				children: [
					{
						id: "2-2-1",
						likes: 0,
						value: "Solang Valley is the best place for paragliding!",
					},
				],
			},
		],
	},
	{
		id: "3",
		likes: 0,
		value:
			"South India has so much to offer - Tamil Nadu temples are magnificent!",
		children: [
			{
				id: "3-1",
				likes: 0,
				value: "Meenakshi Temple in Madurai is absolutely stunning!",
				children: [
					{
						id: "3-1-1",
						likes: 0,
						value: "The architecture is mind-blowing! Every inch is carved.",
						children: [
							{
								id: "3-1-1-1",
								likes: 0,
								value: "And the evening ceremony is a must-see!",
							},
						],
					},
				],
			},
			{
				id: "3-2",
				likes: 0,
				value:
					"Don't miss Pondicherry - French colonial charm with Indian soul!",
				children: [
					{
						id: "3-2-1",
						likes: 0,
						value: "Auroville nearby is also worth visiting!",
					},
					{
						id: "3-2-2",
						likes: 0,
						value: "The cafes in Pondy are amazing!",
					},
				],
			},
			{
				id: "3-3",
				likes: 0,
				value: "Ooty and Kodaikanal for some cool hill station vibes!",
			},
		],
	},
	{
		id: "4",
		likes: 0,
		value: "Uttarakhand for spiritual journeys and Himalayan adventures!",
		children: [
			{
				id: "4-1",
				likes: 0,
				value: "Rishikesh is the yoga capital of the world!",
				children: [
					{
						id: "4-1-1",
						likes: 0,
						value: "River rafting in the Ganges is thrilling!",
						children: [
							{
								id: "4-1-1-1",
								likes: 0,
								value: "Cafe hopping near Laxman Jhula is fun too!",
							},
						],
					},
					{
						id: "4-1-2",
						likes: 0,
						value: "The Beatles Ashram is a cool place to explore.",
					},
				],
			},
			{
				id: "4-2",
				likes: 0,
				value: "Valley of Flowers trek is on my bucket list!",
			},
		],
	},
	{
		id: "5",
		likes: 0,
		value:
			"Mumbai - the city that never sleeps! Great food, culture, and nightlife.",
		children: [
			{
				id: "5-1",
				likes: 0,
				value: "Marine Drive at sunset is iconic!",
			},
			{
				id: "5-2",
				likes: 0,
				value: "Street food - vada pav, pav bhaji, bhel puri - is incredible!",
				children: [
					{
						id: "5-2-1",
						likes: 0,
						value: "Mohammed Ali Road during Ramadan is a food paradise!",
						children: [
							{
								id: "5-2-1-1",
								likes: 0,
								value: "The kebabs and haleem are to die for!",
							},
						],
					},
				],
			},
		],
	},
];
