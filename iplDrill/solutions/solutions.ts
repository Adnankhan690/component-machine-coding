import { readMatchesCsv, readDeliveriesCsv } from "./readCsv.ts";

async function solutionOne() {
	const matches = await readMatchesCsv();
	const matchByYear = matches.reduce(
		(acc, curr) => {
			if (!acc[curr.season]) {
				return {
					...acc,
					[curr.season]: 1,
				};
			}

			return {
				...acc,
				[curr.season]: acc[curr.season] + 1,
			};
		},
		{} as Record<string, number>,
	);

	console.log(matchByYear);
}

async function solutionTwo() {
	const matches = await readMatchesCsv();
	const earWiseWinnerCount = matches.reduce(
		(acc, curr) => {
			if (!acc[curr.season]) {
				return {
					...acc,
					[curr.season]: { [curr.winner]: 1 },
				};
			}

			return {
				...acc,
				[curr.season]: {
					...acc[curr.season],
					[curr.winner]: acc[curr.season][curr.winner]
						? acc[curr.season][curr.winner] + 1
						: 1,
				},
			};
		},
		{} as Record<string, Record<string, number>>,
	);

	console.log(earWiseWinnerCount);
}

async function solutionThree() {
	const matches = await readMatchesCsv();
	const deliveries = await readDeliveriesCsv();

	const matchId2016 = matches.reduce((acc, curr) => {
		if (curr.season === "2016") {
			return [...acc, curr.id];
		}

		return acc;
	}, [] as string[]);

	const extraRunsByteam2016 = deliveries.reduce(
		(acc, curr) => {
			if (matchId2016.includes(curr.match_id)) {
				return {
					...acc,
					[curr.bowling_team]: acc?.[curr.bowling_team]
						? acc[curr.bowling_team] + Number(curr.extra_runs)
						: Number(curr.extra_runs),
				};
			}
			return acc;
		},
		{} as Record<string, number>,
	);
	console.log(extraRunsByteam2016);
}

async function solutionFour() {
	const deliveries = await readDeliveriesCsv();
	const matchIds2015 = await getMatchIdsByYear("2015");

	const matchIds = new Set(matchIds2015);

	const bowlersStat = deliveries.reduce(
		(acc, curr) => {
			if (matchIds.has(curr.match_id)) {
				let isValidBall =
					Number(curr.noball_runs) === 0 && Number(curr.wide_runs) === 0;
				const runs =
					acc[curr.bowler]?.runs +
					Number(curr.total_runs) -
					(Number(curr.bye_runs) + Number(curr.legbye_runs));
				const balls = acc[curr.bowler]?.balls + (isValidBall ? 1 : 0);
				return {
					...acc,
					[curr.bowler]: acc[curr.bowler]
						? { runs: runs, balls: balls }
						: {
								runs:
									Number(curr.total_runs) -
									(Number(curr.bye_runs) + Number(curr.legbye_runs)),
								balls: isValidBall ? 1 : 0,
							},
				};
			}

			return acc;
		},
		{} as Record<string, { runs: number; balls: number }>,
	);

	const bowlerEconomy = Object.entries(bowlersStat).reduce(
		(acc, curr) => {
			const bowler = curr[0];
			const runs = curr[1].runs;
			const balls = curr[1].balls;

			const economy = runs / balls;

			return {
				...acc,
				[bowler]: economy * 6,
			};
		},
		{} as Record<string, number>,
	);

	// console.log(bowlerEconomy);

	const top10BowlerEconomy = Object.fromEntries(
		Object.entries(bowlerEconomy)
			.sort((a, b) => a[1] - b[1])
			.slice(0, 10),
	);
	console.log(top10BowlerEconomy);
}

async function solutionFive() {
	const matches = await readMatchesCsv();

	const tossAndMatchWinner = matches.reduce(
		(acc, curr) => {
			const tossWinner = curr.toss_winner;
			const matchWinner = curr.winner;
			if (tossWinner === matchWinner) {
				return {
					...acc,
					[matchWinner]: acc[matchWinner] ? acc[matchWinner] + 1 : 1,
				};
			}

			return acc;
		},
		{} as Record<string, number>,
	);

	console.log(tossAndMatchWinner);
}

//revise
async function solutionSix() {
	const matches = await readMatchesCsv();
	const playerOfMatchList = matches.reduce(
		(acc, curr) => {
			const season = curr.season;
			const player = curr.player_of_match;

			const currentStats = acc[season] || {};
			const playerCount = (currentStats[player] || 0) + 1;

			return {
				...acc,
				[season]: { ...currentStats, [player]: playerCount },
			};
		},
		{} as Record<string, Record<string, number>>,
	);

	//this is how to sort nested object
	// const sortedPOMList = Object.fromEntries(
	// 		Object.entries(playerOfMatchList).map(([years, players]) => {
	// 			const sortedPlayers = Object.entries(players).sort(
	// 				(a, b) => b[1] - a[1],
	// 			);

	// 			return [years, Object.fromEntries(sortedPlayers)];
	// 		}),
	// 	);

	const topAwardeesPerSeason = Object.entries(playerOfMatchList).map(
		([year, players]) => {
			const topPlayer = Object.entries(players).reduce((acc, curr) => {
				return curr[1] > acc[1] ? curr : acc;
			});

			return {
				year,
				player: topPlayer[0],
				count: topPlayer[1],
			};
		},
	);

	console.log(topAwardeesPerSeason);
}

//revise
async function solutionSeven() {
	const matches = await readMatchesCsv();
	const deliveries = await readDeliveriesCsv();

	const matchIdsBySeason = matches.reduce(
		(acc, curr) => {
			const season = curr.season;
			const currMatchId = Number(curr.id);
			let matchIds = acc[season] || [];

			return {
				...acc,
				[season]: [...matchIds, currMatchId],
			};
		},
		{} as Record<string, number[]>,
	);

	const strikeRate = deliveries.reduce(
		(acc, curr) => {
			const batsmanRuns = Number(curr.batsman_runs);
			const batsMan = curr.batsman;
			const wideRuns = Number(curr.wide_runs);
			const noBallRuns = Number(curr.noball_runs);
			const isValidBall = wideRuns === 0 && noBallRuns === 0;
			const matchId = Number(curr.match_id);

			const season = Object.entries(matchIdsBySeason).reduce((acc, curr) => {
				const season = curr[0];
				const matchIds = curr[1];

				if (matchIds.includes(matchId)) {
					return season;
				}

				return acc;
			}, "");

			const existingSeason = acc[season] || {};
			const currentPlayerData = existingSeason[batsMan] || {
				runs: 0,
				balls: 0,
			};

			const player = {
				...currentPlayerData,
				runs: currentPlayerData?.runs + batsmanRuns,
				balls: currentPlayerData?.balls + (isValidBall ? 1 : 0),
			};

			return {
				...acc,
				[season]: {
					...existingSeason,
					[curr.batsman]: player,
				},
			};
		},
		{} as Record<string, Record<string, { runs: number; balls: number }>>,
	);

	console.log(strikeRate);
}

async function solutionEight() {
	const deliveries = await readDeliveriesCsv();

	const batsmanDismissalByBowlerStat = deliveries.reduce(
		(acc, curr) => {
			const playerDismissed = curr["player_dismissed"];
			const bowlerName = curr["bowler"];

			if (playerDismissed === "") return { ...acc };
			if (!acc[playerDismissed]) {
				const newDismissedStat = {
					...acc,
					[playerDismissed]: { [bowlerName]: 1 },
				};
				return newDismissedStat;
			}

			const existingBowlerObj = acc[playerDismissed];
			if (!existingBowlerObj[bowlerName]) {
				const newBowlerstat = { ...existingBowlerObj, [bowlerName]: 1 };
				return { ...acc, [playerDismissed]: { ...newBowlerstat } };
			}

			const existingBowlerDismissal = existingBowlerObj[bowlerName];

			return {
				...acc,
				[playerDismissed]: {
					...existingBowlerObj,
					[bowlerName]: existingBowlerDismissal + 1,
				},
			};
		},
		{} as Record<string, Record<string, number>>,
	);

	let topScore = {} as Record<string, number>;
	let scoreCount = 0;

	Object.values(batsmanDismissalByBowlerStat).forEach((obj) => {
		Object.entries(obj).forEach((ele) => {
			const playerName = ele[0];
			const playerDismissalScore = ele[1];
			if (playerDismissalScore > scoreCount) {
				topScore = { [playerName]: playerDismissalScore };
				scoreCount = playerDismissalScore;
			}
		});
	});

	// Object.values(batsmanDismissalByBowlerStat).forEach((obj) => {
	// 	Object.entries(obj).filter((ele) => {
	// 		if (ele[0] === "Harbhajan Singh") {
	// 			console.log(ele[1]);
	// 			return ele[1]
	// 		}
	// 	})
	// })

	console.log(batsmanDismissalByBowlerStat);
}

async function solutionNine() {
	const deliveries = await readDeliveriesCsv();

	const bowlerStat = deliveries.reduce(
		(acc, curr) => {
			const superOver = Number(curr["is_super_over"]);
			const bowler = curr["bowler"];
			const runs = Number(curr["total_runs"]);
			const isNoBall = Number(curr["noball_runs"]) === 0;
			const isWideBall = Number(curr["wide_runs"]) === 0;
			const isValidBall = isNoBall && isWideBall;
			const ball = isValidBall === true ? 1 : 0;

			if (!superOver) return acc;

			if (!acc[bowler]) {
				const newStat = {
					...acc,
					[bowler]: { ["run"]: runs, ["balls"]: ball },
				};
				return newStat;
			}

			const existingBowlerStat = acc[bowler];
			const totalBalls = existingBowlerStat["balls"] + ball;
			const existingRuns = existingBowlerStat["run"] || 0;
			const totalRuns = existingRuns + runs;

			return {
				...acc,
				[bowler]: {
					["run"]: totalRuns,
					["balls"]: totalBalls,
				},
			};
		},
		{} as Record<string, Record<string, number>>,
	);

	console.log(bowlerStat);
}

async function solutionNineT() {
	const deliveries = await readDeliveriesCsv();

	const bowlerStat = deliveries
		.filter((ele) => Number(ele["is_super_over"]) !== 0)
		.reduce(
			(acc, curr) => {
				const bowlerName = curr["bowler"];
				const runScored = Number(curr["total_runs"]);
				const isWideBall = Number(curr["wide_runs"]) === 0;
				const isNoBall = Number(curr["noball_runs"]) === 0;

				const isValidBall = isWideBall && isNoBall;
				const ball = isValidBall ? 1 : 0;

				if (!acc[bowlerName]) {
					return { ...acc, [bowlerName]: { ["runs"]: 1, ["balls"]: ball } };
				}

				const bowlerStat = acc[bowlerName];
				const existingRuns = bowlerStat["runs"] || 0;
				return {
					...acc,
					[bowlerName]: {
						["runs"]: existingRuns + runScored,
						["balls"]: bowlerStat["balls"] + ball,
					},
				};
			},
			{} as Record<string, Record<string, number>>,
		);

	const bestEconomy = Object.entries(bowlerStat).reduce(
		(acc, curr) => {
			const bowlerName = curr[0];
			const stat = curr[1];
			const runs = stat["runs"];
			const overs = stat["balls"] / 6;

			const economy = runs / overs;
			if (Object.values(acc).length === 0) return { [bowlerName]: economy };

			const currentBestEconomy = Object.values(acc)[0];
			
			if (currentBestEconomy > economy) {
				return { [bowlerName]: economy };
			}

			return acc;
		},
		{} as Record<string, number>,
	);

	console.log(bestEconomy);
}

async function getMatchIdsByYear(year: string) {
	const matches = await readMatchesCsv();
	return matches
		.filter((match) => match.season === year)
		.map((match) => match.id);
}

// await solutionOne();
// await solutionTwo();
// await solutionThree();
// await solutionFour();
// await solutionFive();
// await solutionSix();
// await solutionSeven();
// await solutionNine();
await solutionNineT();
