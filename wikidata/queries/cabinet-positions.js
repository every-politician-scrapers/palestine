const fs = require('fs');
let rawmeta = fs.readFileSync('meta.json');
let meta = JSON.parse(rawmeta);

module.exports = function () {
    return `SELECT DISTINCT ?item ?itemLabel ?ministry ?ministryLabel ?country ?jurisdiction (YEAR(?start) AS ?began) (YEAR(?end) AS ?ended)
       (COUNT(DISTINCT ?person) AS ?holders)
    WHERE {
      ?item p:P361 ?ps .
      ?ps ps:P361 wd:${meta.cabinet.parent}
      FILTER NOT EXISTS { ?ps wikibase:rank wikibase:DeprecatedRank }
      OPTIONAL { ?item wdt:P2389 ?ministry }
      OPTIONAL { ?item wdt:P571|wdt:P580 ?start }
      OPTIONAL { ?item wdt:P576|wdt:P582 ?end }
      OPTIONAL { ?item wdt:P17 ?country }
      OPTIONAL { ?item wdt:P1001 ?jurisdiction }
      OPTIONAL { ?person p:P39/ps:P39 ?item }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    # ${new Date().toISOString()}
    GROUP BY ?item ?itemLabel ?ministry ?ministryLabel ?country ?jurisdiction ?start ?end
    ORDER BY ?itemLabel ?start ?item`
}
