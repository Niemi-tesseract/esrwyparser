let fs = require('fs');
let output = [];

fs.readFile('lrbb.rwy', {
	encoding: 'utf8'
}, function (err, data) {
	if (err) {
		return console.error(err);
	}
	var moremoudulation = data.replace(/^ACTIVE_RUNWAY.*\n?/gm, '');
	var modulatedData = moremoudulation.replace(/(\r\n|\n|\r)/gm, "%$");
	var splitted = modulatedData.split(/\%\$/);

	var start = data.replace(/^ACTIVE_AIRPORT.*\n?/gm, '');
	var middle = start.replace(/(\r\n|\n|\r)/gm, "%$");
	var ending = middle.split(/\%\$/);
	//	/console.log(splitted)

	for (var i = 1; i < splitted.length; i++) {
		var airport = splitted[i].substring(15, 19);
		var use = splitted[i].slice(-1);
		var index = output.findIndex(x => x.identifier == airport)
		if (index === -1) {
			output.push({
				"identifier": airport,
				"runways": []
			});
		}
	}

	for (var l = 0; l < ending.length; l++) {
		var airport = ending[l].substring(14, 18);
		var runway = ending[l].substring(19, 22);
		var use = ending[l].slice(-1);

		if (runway.slice(-1) == ":") {
			runway = runway.substring(0, 2)
		}
		//var runway = ending[l].slice(-7);
		//console.log(airport)
		var index = output.findIndex(x => x.identifier == airport)
		var indexrwy = output[index].runways.findIndex(x => x.name == runway)
		//console.log(airport + ":" + index)
		//console.log(indexrwy)
		if (use == 0) {
			use = "arr"
		} else if (use == 1) {
			use = "dep"
		}
		if (indexrwy == -1) {
			output[index].runways.push({
				"name": runway,
				"use": use
			});
		} else if (indexrwy >= 0) {
			output[index].runways[indexrwy].use = "deparr"
		}
	}

	fs.writeFile("output", JSON.stringify(output))
});
