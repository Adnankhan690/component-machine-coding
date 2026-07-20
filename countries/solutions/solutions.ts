import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

type Country = {
	name: {
		common: string;
		official?: string;
	};
	continents: string[];
};

async function readJsonFile<T>(relativePath: string): Promise<T> {
	const currentDir = path.dirname(fileURLToPath(import.meta.url));
	const filePath = path.resolve(currentDir, relativePath);
	const fileContent = await readFile(filePath, "utf-8");
	return JSON.parse(fileContent) as T;
}

async function groupByContinent() {
	const countries = await readJsonFile<Country[]>("../data/countries.json");

	const groupbyCountries = countries.reduce(
		(acc, curr) => {
			const countryName = curr.name && curr.name["common"];
			const continents = curr["continents"];

			const subList = continents.reduce(
				(nAcc, nCurr) => {
					const continent = nCurr;
					if (!acc[continent]) {
						return { ...acc, [continent]: [countryName] };
					}

					return {
						...acc,
						[continent]: [...acc[continent], countryName],
					};
				},
				{} as Record<string, string[]>,
			);

			return { ...acc, ...subList };
		},
		{} as Record<string, string[]>,
	);
	console.log(groupbyCountries);
}

async function groupByCarSide() {
	const countries = await readJsonFile("../data/countries.json");

	const groupBySide = countries.reduce((acc, curr) => {
		const countryName = curr["name"]["common"];
		const carSide = curr["car"]["side"];

		if (!acc[carSide]) {
			return {...acc, [carSide]: [countryName]}
		}
		
		return {...acc, [carSide]: [...acc[carSide], countryName]}
	}, {} as Record<string, string[]>);

	console.log(groupBySide);
}

// type DensityByCountries {
// 	name
// }

//todo : roundoff, sort

async function top10DenseCountries() {
	const countries = await readJsonFile("../data/countries.json");

	const countryWithDensity = countries.reduce((acc, curr) => {
		const area = curr["area"];
		const population = curr["population"];
		const countryName = curr["name"]["common"];

		const density = population / area;

		return [...acc, { [countryName]: density.toFixed(3) }];

	}, [] as [string, number][])

	const sortedCountryByDensity = countryWithDensity.sort((a, b) => {
		const densityA = Object.values(a)[0];
		const densityB = Object.values(b)[0];
		return densityB - densityA
	}).slice(0,10)

	console.log(sortedCountryByDensity);
	
}

//List countries by currency
type CurrencyList = {
	currency: string;
	countires: string[];
};

async function CountriesByCurrencies() {
	const countries = await readJsonFile("../data/countries.json");

	const crList = countries.reduce((acc, curr) => {
		const countryName = curr["name"]["common"];
		const currencyKey = curr["currencies"] || {};
		const currencyObj = Object.values(currencyKey)[0] || {};
		const currency = Object.values(currencyObj)[0];
		// const currency = Object.values(currencyObj)[0];

		const existingIndex = acc.findIndex((item) => item.currency === currency);

		if (existingIndex !== -1) {
			acc[existingIndex] = {
				...acc[existingIndex],
				countries: [...acc[existingIndex].countries, countryName],
			};
			return acc;
		}

		acc.push({ currency, countries: [countryName] });
		return acc;

	}, [] as CurrencyList[]);

	const filteredByCurrency = crList.filter((country) => country.currency === "Euro");

	console.log(filteredByCurrency);
}

await CountriesByCurrencies();
