`` Medium ``
Find all countries in a given region and return their name.common, capital, and population, sorted by population descending.

Count how many countries use each car.side (left vs right) and print the country names in each group.

For each country, compute population density as population / area, then return the top 10 most densely populated countries.

Filter Countries by currency //r


`` Hard ``
Build a search that matches a keyword against name.common, name.official, and every value inside altSpellings, then return the matching countries without duplicates.

Extract every language from the languages object across all countries and produce a reverse index:
language -> []countries that speak it, sorted by the number of countries descending.

Normalize optional nested fields safely and generate a summary struct per country with:
commonName, officialName, cca2, cca3, capital, currencyCodes, languageNames, timezoneCount, hasPostalCode, isUNMember.
The challenge is handling missing arrays/maps without panics and producing consistent output.